const Policy = require('../models/Policy.model');
const Claim = require('../models/Claim.model');
const Payout = require('../models/Payout.model');
const Worker = require('../models/Worker.model');
const DisruptionEvent = require('../models/DisruptionEvent.model');
const { getAllZoneData } = require('../utils/zoneMapper');
const { generatePrediction } = require('../services/gemini.service');
const { getCurrentWeather } = require('../services/weather.service');

/**
 * @desc Admin overview stats
 * @route GET /api/analytics/admin/overview
 */
const getAdminOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      activePolicies,
      weekClaims,
      weekPayouts,
      fraudFlags,
      totalWorkers
    ] = await Promise.all([
      Policy.countDocuments({ status: 'active', endDate: { $gte: now } }),
      Claim.countDocuments({ createdAt: { $gte: weekAgo } }),
      Payout.aggregate([
        { $match: { createdAt: { $gte: weekAgo }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Claim.countDocuments({ fraudScore: { $gte: 70 }, status: 'flagged_fraud' }),
      Worker.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        activePolicies,
        totalActivePolicies: activePolicies, // Added for test compatibility
        weeklyClaimsCount: weekClaims,
        totalClaimsThisWeek: weekClaims, // Added for test compatibility
        weeklyPayoutsTotal: weekPayouts[0]?.total || 0,
        totalPayoutsThisWeek: weekPayouts[0]?.total || 0, // Added for test compatibility
        openFraudFlags: fraudFlags,
        totalWorkers
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Zone risk scores for Leaflet heatmap
 * @route GET /api/analytics/admin/zone-risk
 */
const getZoneRisk = async (req, res, next) => {
  try {
    const zoneData = getAllZoneData();

    // Enhance with real claim data
    const enhancedZones = await Promise.all(zoneData.map(async (zone) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const zoneClaims = await Claim.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      const zoneWorkers = await Worker.countDocuments({ 'zone.area': zone.name });

      return {
        ...zone,
        claimsLast30Days: zoneClaims,
        workersCount: zoneWorkers
      };
    }));

    res.json({ success: true, data: enhancedZones });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Loss ratio data for Recharts
 * @route GET /api/analytics/admin/loss-ratio
 */
const getLossRatio = async (req, res, next) => {
  try {
    const weeks = 8;
    const data = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const [premiums, payouts] = await Promise.all([
        Policy.aggregate([
          { $match: { createdAt: { $gte: weekStart, $lt: weekEnd } } },
          { $group: { _id: null, total: { $sum: '$weeklyPremium' } } }
        ]),
        Payout.aggregate([
          { $match: { createdAt: { $gte: weekStart, $lt: weekEnd }, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);

      data.push({
        week: `W${weeks - i}`,
        weekStart: weekStart.toISOString().split('T')[0],
        premiumsCollected: premiums[0]?.total || 0,
        payoutsMade: payouts[0]?.total || 0,
        lossRatio: premiums[0]?.total
          ? ((payouts[0]?.total || 0) / premiums[0].total * 100).toFixed(1)
          : 0
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Gemini prediction for next week disruption risk
 * @route GET /api/analytics/admin/predictions
 */
const getPredictions = async (req, res, next) => {
  try {
    const [currentWeather, recentEvents, zoneData] = await Promise.all([
      getCurrentWeather(),
      DisruptionEvent.find().sort({ timestamp: -1 }).limit(10).lean(),
      Promise.resolve(getAllZoneData())
    ]);

    const prediction = await generatePrediction({ currentWeather, recentEvents, zoneData });

    res.json({ success: true, data: prediction });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Worker earnings protected and claim summary
 * @route GET /api/analytics/worker/summary
 */
const getWorkerSummary = async (req, res, next) => {
  try {
    const workerId = req.user._id;

    const [
      totalClaims,
      paidClaims,
      totalPayouts,
      activePolicy,
      currentWeather
    ] = await Promise.all([
      Claim.countDocuments({ workerId }),
      Claim.countDocuments({ workerId, status: 'paid' }),
      Payout.aggregate([
        { $match: { workerId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Policy.findOne({ workerId, status: 'active', endDate: { $gte: new Date() } }),
      getCurrentWeather()
    ]);

    res.json({
      success: true,
      data: {
        totalClaims,
        paidClaims,
        totalEarningsProtected: activePolicy?.maxWeeklyPayout || 0,
        earningsProtected: activePolicy?.maxWeeklyPayout || 0,
        totalPayouts: totalPayouts[0]?.total || 0,
        hasActivePolicy: !!activePolicy,
        activePolicyTier: activePolicy?.tier || null,
        maxWeeklyPayout: activePolicy?.maxWeeklyPayout || 0,
        weather: currentWeather
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminOverview, getZoneRisk, getLossRatio, getPredictions, getWorkerSummary };
