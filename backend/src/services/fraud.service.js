const Claim = require('../models/Claim.model');
const Worker = require('../models/Worker.model');
const { analyzeFraud } = require('./gemini.service');

// === AUDIT 1 EXISTING CHECKS ===

const checkGPSZoneMatch = (workerCoordinates, disruptionZone) => {
  if (!workerCoordinates || workerCoordinates.lat == null || workerCoordinates.lng == null) {
    return true; // If we don't have mock coordinates, we assume they are in zone to prevent auto-reject in MVP.
  }
  
  const zoneBoundaries = {
    'Patia': { minLat: 20.31, maxLat: 20.35, minLng: 85.81, maxLng: 85.86 },
    'Nayapalli': { minLat: 20.28, maxLat: 20.32, minLng: 85.80, maxLng: 85.84 },
    'Saheed Nagar': { minLat: 20.27, maxLat: 20.30, minLng: 85.83, maxLng: 85.87 },
    'Khandagiri': { minLat: 20.24, maxLat: 20.28, minLng: 85.77, maxLng: 85.81 },
    'Rasulgarh': { minLat: 20.28, maxLat: 20.32, minLng: 85.84, maxLng: 85.88 },
    'Unit-4': { minLat: 20.25, maxLat: 20.28, minLng: 85.83, maxLng: 85.86 },
    'Chandrasekharpur': { minLat: 20.31, maxLat: 20.35, minLng: 85.77, maxLng: 85.82 }
  };
  const boundary = zoneBoundaries[disruptionZone];
  if (!boundary) return true;
  const tolerance = 0.005;
  return workerCoordinates.lat >= boundary.minLat - tolerance &&
    workerCoordinates.lat <= boundary.maxLat + tolerance &&
    workerCoordinates.lng >= boundary.minLng - tolerance &&
    workerCoordinates.lng <= boundary.maxLng + tolerance;
};

const checkDeliveryActivity = async (workerId, disruptionTimestamp) => {
  const windowStart = new Date(disruptionTimestamp.getTime() - 30 * 60 * 1000);
  const windowEnd = new Date(disruptionTimestamp.getTime() + 60 * 60 * 1000);
  const recentClaims = await Claim.find({ workerId, status: 'paid', createdAt: { $gte: windowStart, $lte: windowEnd } });
  return recentClaims.length > 0;
};

const checkDuplicateClaim = async (workerId, disruptionEventId) => {
  const existing = await Claim.findOne({ workerId, disruptionEventId });
  return !!existing;
};

const checkPolicyAge = (policyCreatedAt) => {
  const hoursSincePurchase = (Date.now() - new Date(policyCreatedAt).getTime()) / (1000 * 60 * 60);
  return hoursSincePurchase < 24;
};

const checkClaimFrequencyAnomaly = async (workerId, zoneArea) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const workerClaimCount = await Claim.countDocuments({ workerId, createdAt: { $gte: thirtyDaysAgo } });
  const workersInZone = await Worker.find({ 'zone.area': zoneArea, _id: { $ne: workerId } }).select('_id');
  const zoneWorkerIds = workersInZone.map(w => w._id);
  const totalZoneClaims = await Claim.countDocuments({ workerId: { $in: zoneWorkerIds }, createdAt: { $gte: thirtyDaysAgo } });
  const avgZoneClaims = zoneWorkerIds.length > 0 ? totalZoneClaims / zoneWorkerIds.length : 0;
  return workerClaimCount > avgZoneClaims * 3;
};

// === AUDIT 2 ANTI-SPOOFING CHECKS ===

const checkZoneClaimVelocity = async (zoneArea, disruptionEventId) => {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const recentClaimsInZone = await Claim.countDocuments({ 'zone.area': zoneArea, disruptionEventId: disruptionEventId, createdAt: { $gte: twoMinutesAgo } });
  return { count: recentClaimsInZone, isSuspicious: recentClaimsInZone > 10 };
};

const checkHistoricalZonePresence = async (workerId, claimedZone) => {
  const worker = await Worker.findById(workerId);
  if (!worker.deliveryZones || worker.deliveryZones.length === 0) {
    return { hasPresence: false, visitCount: 0 };
  }
  const zoneVisit = worker.deliveryZones.find(z => z.area === claimedZone);
  return { hasPresence: !!zoneVisit, visitCount: zoneVisit ? zoneVisit.visitCount : 0 };
};

const checkClaimTiming = (disruptionEventTimestamp) => {
  const secondsSinceTrigger = (Date.now() - new Date(disruptionEventTimestamp).getTime()) / 1000;
  return { secondsSinceTrigger: Math.round(secondsSinceTrigger), isSuspicious: secondsSinceTrigger < 60 };
};

const checkSharedUPI = async (workerId, upiId) => {
  if (!upiId) return { isShared: false, count: 0 };
  const sharedCount = await Worker.countDocuments({ upiId: upiId, _id: { $ne: workerId } });
  return { isShared: sharedCount > 0, count: sharedCount };
};

const checkCoordinateTeleportation = (currentCoords, previousCoords, timeDiffMinutes) => {
  if (!previousCoords || !currentCoords) return { isTeleported: false };
  const latDiff = Math.abs(currentCoords.lat - previousCoords.lat);
  const lngDiff = Math.abs(currentCoords.lng - previousCoords.lng);
  const distanceKm = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
  const speedKmh = (distanceKm / timeDiffMinutes) * 60;
  return { isTeleported: speedKmh > 150, speedKmh: Math.round(speedKmh) };
};

// === AUDIT 4 MAIN FRAUD RUNNER ===

const runAllFraudChecks = async (worker, policy, claim, disruptionEvent) => {
  let fraudScore = 0;
  const fraudReasons = [];
  const checkResults = {};

  const gpsMatch = checkGPSZoneMatch(worker.zone.coordinates, disruptionEvent.affectedZones[0]);
  checkResults.gpsMatch = gpsMatch;
  if (!gpsMatch) { fraudScore += 35; fraudReasons.push('GPS coordinates outside disruption zone'); }

  const hasActivity = await checkDeliveryActivity(worker._id, disruptionEvent.timestamp);
  checkResults.hasActivity = hasActivity;
  if (hasActivity) { fraudScore += 40; fraudReasons.push('Delivery activity detected during claimed disruption window'); }

  const isDuplicate = await checkDuplicateClaim(worker._id, disruptionEvent._id);
  checkResults.isDuplicate = isDuplicate;
  if (isDuplicate) {
    fraudScore = 100;
    fraudReasons.push('Duplicate claim for same disruption event');
    return { fraudScore, fraudReasons, checkResults };
  }

  const isPolicyTooNew = checkPolicyAge(policy.createdAt);
  checkResults.isPolicyTooNew = isPolicyTooNew;
  if (isPolicyTooNew) { fraudScore += 30; fraudReasons.push('Policy purchased less than 24 hours before claim'); }

  const isFrequencyAnomaly = await checkClaimFrequencyAnomaly(worker._id, worker.zone.area);
  checkResults.isFrequencyAnomaly = isFrequencyAnomaly;
  if (isFrequencyAnomaly) { fraudScore += 25; fraudReasons.push('Claim frequency 3x higher than zone peer average'); }

  const velocityResult = await checkZoneClaimVelocity(worker.zone.area, disruptionEvent._id);
  checkResults.zoneVelocity = velocityResult.count;
  if (velocityResult.isSuspicious) { fraudScore += 45; fraudReasons.push(`Abnormal claim velocity: ${velocityResult.count} claims in zone in last 2 minutes`); }

  const presenceResult = await checkHistoricalZonePresence(worker._id, worker.zone.area);
  checkResults.historicalPresence = presenceResult.visitCount;
  if (!presenceResult.hasPresence) { fraudScore += 30; fraudReasons.push('Worker has no historical delivery presence in claimed zone'); }

  const timingResult = checkClaimTiming(disruptionEvent.timestamp);
  checkResults.secondsSinceTrigger = timingResult.secondsSinceTrigger;
  if (timingResult.isSuspicious) { fraudScore += 25; fraudReasons.push(`Claim filed only ${timingResult.secondsSinceTrigger} seconds after trigger fired`); }

  const upiResult = await checkSharedUPI(worker._id, worker.upiId);
  checkResults.sharedUPI = upiResult.count;
  if (upiResult.isShared) { fraudScore += 80; fraudReasons.push(`UPI ID shared with ${upiResult.count} other worker accounts`); }

  if (worker.lastKnownLocation && worker.lastKnownLocation.updatedAt) {
    const timeDiffMinutes = (Date.now() - new Date(worker.lastKnownLocation.updatedAt).getTime()) / (1000 * 60);
    const teleportResult = checkCoordinateTeleportation(worker.zone.coordinates, worker.lastKnownLocation, timeDiffMinutes);
    checkResults.teleported = teleportResult.isTeleported;
    if (teleportResult.isTeleported) { fraudScore += 35; fraudReasons.push(`Impossible movement speed detected: ${teleportResult.speedKmh} km/h`); }
  }

  fraudScore = Math.min(100, fraudScore);
  return { fraudScore, fraudReasons, checkResults };
};

const getClaimStatusFromFraudScore = (fraudScore) => {
  if (fraudScore <= 30) return 'auto_approved';
  if (fraudScore <= 69) return 'conditionally_approved';
  return 'flagged_fraud';
};

module.exports = {
  runAllFraudChecks,
  checkGPSZoneMatch,
  checkZoneClaimVelocity,
  checkHistoricalZonePresence,
  checkClaimTiming,
  checkSharedUPI,
  checkCoordinateTeleportation,
  getClaimStatusFromFraudScore
};


