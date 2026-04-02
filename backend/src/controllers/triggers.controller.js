const { getCurrentWeather } = require('../services/weather.service');
const { getCurrentAQI } = require('../services/aqi.service');
const DisruptionEvent = require('../models/DisruptionEvent.model');
const { autoCreateClaims } = require('../services/claims.service');
const { determineSeverity } = require('../utils/payoutCalculator');
const { getAllZones } = require('../utils/zoneMapper');

/**
 * @desc Get live weather and AQI for Bhubaneswar
 * @route GET /api/triggers/current
 */
const getCurrentTriggers = async (req, res, next) => {
  try {
    const [weather, aqi] = await Promise.all([
      getCurrentWeather(),
      getCurrentAQI()
    ]);

    const thresholds = {
      heavy_rain: { value: 15, current: weather.rain, unit: 'mm/hr', exceeded: weather.rain >= 15 },
      extreme_heat: { value: 43, current: weather.temp, unit: '°C', exceeded: weather.temp >= 43 },
      cyclone_storm: { value: 60, current: weather.windSpeed, unit: 'km/hr', exceeded: weather.windSpeed >= 60 },
      severe_pollution: { value: 300, current: aqi.aqi, unit: 'AQI', exceeded: aqi.aqi >= 300 }
    };

    res.json({
      success: true,
      data: {
        weather,
        aqi,
        thresholds,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get currently active disruption events
 * @route GET /api/triggers/active
 */
const getActiveDisruptions = async (req, res, next) => {
  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const activeEvents = await DisruptionEvent.find({
      timestamp: { $gte: sixHoursAgo }
    }).sort({ timestamp: -1 });

    res.json({ success: true, data: activeEvents });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Admin fires manual disruption (for demo purposes)
 * @route POST /api/triggers/manual
 */
const fireManualTrigger = async (req, res, next) => {
  try {
    const { type, reading, zones } = req.body;

    if (!type || !reading) {
      return res.status(400).json({ success: false, message: 'Type and reading are required' });
    }

    const validTypes = ['heavy_rain', 'extreme_heat', 'cyclone_storm', 'severe_pollution', 'zone_lockdown'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid trigger type' });
    }

    const affectedZones = zones && zones.length > 0 ? zones : getAllZones();
    const severity = determineSeverity(type, reading);

    const thresholds = {
      heavy_rain: 15,
      extreme_heat: 43,
      cyclone_storm: 60,
      severe_pollution: 300
    };

    const threshold = thresholds[type];
    if (threshold && reading < threshold) {
      return res.status(400).json({
        success: false,
        message: `Reading ${reading} is below threshold ${threshold} for ${type}`
      });
    }

    const unitMap = {
      heavy_rain: 'mm/hr', extreme_heat: 'celsius',
      cyclone_storm: 'km/hr', severe_pollution: 'AQI', zone_lockdown: 'manual'
    };

    // Create disruption event
    const event = await DisruptionEvent.create({
      type,
      city: 'Bhubaneswar',
      affectedZones,
      reading,
      unit: unitMap[type],
      severity,
      source: 'Manual Admin'
    });

    // Auto-create claims
    const result = await autoCreateClaims(event);

    res.status(201).json({
      success: true,
      data: {
        event,
        claimsCreated: result.claimsCreated,
        payoutsProcessed: result.payoutsProcessed,
        totalPayoutAmount: result.totalPayoutAmount
      },
      message: `Manual ${type} trigger fired — ${result.claimsCreated} claims created`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get disruption event history
 * @route GET /api/triggers/history
 */
const getDisruptionHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const events = await DisruptionEvent.find()
      .sort({ timestamp: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await DisruptionEvent.countDocuments();

    res.json({
      success: true,
      data: events,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrentTriggers, getActiveDisruptions, fireManualTrigger, getDisruptionHistory };
