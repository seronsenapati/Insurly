const { ZONE_RISK_SCORES } = require('../services/brainjs.service');

/**
 * Bhubaneswar zone coordinates mapping
 */
const ZONE_COORDINATES = {
  'Patia': { lat: 20.3555, lng: 85.8190 },
  'Nayapalli': { lat: 20.2950, lng: 85.8010 },
  'Saheed Nagar': { lat: 20.2870, lng: 85.8400 },
  'Khandagiri': { lat: 20.2560, lng: 85.7780 },
  'Rasulgarh': { lat: 20.3020, lng: 85.8590 },
  'Unit-4': { lat: 20.2730, lng: 85.8300 },
  'Chandrasekharpur': { lat: 20.3340, lng: 85.8140 }
};

/**
 * Zone pincodes mapping
 */
const ZONE_PINCODES = {
  'Patia': '751024',
  'Nayapalli': '751012',
  'Saheed Nagar': '751007',
  'Khandagiri': '751030',
  'Rasulgarh': '751010',
  'Unit-4': '751001',
  'Chandrasekharpur': '751016'
};

/**
 * Get all zone names
 * @returns {string[]}
 */
const getAllZones = () => Object.keys(ZONE_COORDINATES);

/**
 * Get coordinates for a zone
 * @param {string} zoneName
 * @returns {{ lat: number, lng: number } | null}
 */
const getZoneCoordinates = (zoneName) => ZONE_COORDINATES[zoneName] || null;

/**
 * Get risk score for a zone
 * @param {string} zoneName
 * @returns {number}
 */
const getZoneRiskScore = (zoneName) => ZONE_RISK_SCORES[zoneName] || 0.5;

/**
 * Get pincode for a zone
 * @param {string} zoneName
 * @returns {string}
 */
const getZonePincode = (zoneName) => ZONE_PINCODES[zoneName] || '751001';

/**
 * Get zone data for all zones (for heatmap)
 * @returns {Array<{ name: string, coordinates: { lat: number, lng: number }, riskScore: number, pincode: string }>}
 */
const getAllZoneData = () => {
  return getAllZones().map(name => ({
    name,
    area: name, // Added for test compatibility
    coordinates: ZONE_COORDINATES[name],
    riskScore: ZONE_RISK_SCORES[name],
    pincode: ZONE_PINCODES[name]
  }));
};

/**
 * Check if coordinates are within a zone (simple radius check ~2km)
 * @param {number} lat
 * @param {number} lng
 * @param {string} zoneName
 * @returns {boolean}
 */
const isInZone = (lat, lng, zoneName) => {
  const zoneCoords = ZONE_COORDINATES[zoneName];
  if (!zoneCoords) return false;

  const distance = Math.sqrt(
    Math.pow(lat - zoneCoords.lat, 2) + Math.pow(lng - zoneCoords.lng, 2)
  );

  return distance < 0.02; // ~2km radius
};

module.exports = {
  ZONE_COORDINATES,
  ZONE_PINCODES,
  getAllZones,
  getZoneCoordinates,
  getZoneRiskScore,
  getZonePincode,
  getAllZoneData,
  isInZone
};
