const cron = require('node-cron');
const { getCurrentWeather } = require('../services/weather.service');
const { getCurrentAQI } = require('../services/aqi.service');
const { autoCreateClaims } = require('../services/claims.service');
const { runAllFraudChecks } = require('../services/fraud.service');
const Worker = require('../models/Worker.model');
const Policy = require('../models/Policy.model');
const DisruptionEvent = require('../models/DisruptionEvent.model');
const { determineSeverity } = require('../utils/payoutCalculator');
const { getAllZones } = require('../utils/zoneMapper');

/** Trigger thresholds */
const THRESHOLDS = {
  heavy_rain: { value: 15, unit: 'mm/hr' },
  extreme_heat: { value: 43, unit: 'celsius' },
  cyclone_storm: { value: 60, unit: 'km/hr' },
  severe_pollution: { value: 300, unit: 'AQI' }
};

/**
 * Start the trigger monitor cron job
 * Runs every 15 minutes (configurable via TRIGGER_CHECK_INTERVAL)
 */
const startTriggerMonitor = () => {
  const cronExpression = process.env.TRIGGER_CHECK_INTERVAL || '*/15 * * * *';

  console.log(`[${new Date().toISOString()}] ⏰ Trigger monitor started — schedule: ${cronExpression}`);

  cron.schedule(cronExpression, async () => {
    const timestamp = new Date().toISOString();

    try {
      // Step 1 & 2: Fetch weather and AQI data
      const [weatherData, aqiData] = await Promise.all([
        getCurrentWeather(),
        getCurrentAQI()
      ]);


      const disruptions = [];
      const allZones = getAllZones();

      // Step 3: Check rainfall
      if (weatherData.rain >= THRESHOLDS.heavy_rain.value) {
        const severity = determineSeverity('heavy_rain', weatherData.rain);
        disruptions.push({
          type: 'heavy_rain',
          reading: weatherData.rain,
          unit: 'mm/hr',
          severity,
          source: 'OpenWeatherMap',
          affectedZones: allZones
        });
      }

      // Step 4: Check temperature
      if (weatherData.temp >= THRESHOLDS.extreme_heat.value) {
        const severity = determineSeverity('extreme_heat', weatherData.temp);
        disruptions.push({
          type: 'extreme_heat',
          reading: weatherData.temp,
          unit: 'celsius',
          severity,
          source: 'OpenWeatherMap',
          affectedZones: allZones
        });
      }

      // Step 5: Check wind speed
      if (weatherData.windSpeed >= THRESHOLDS.cyclone_storm.value) {
        const severity = determineSeverity('cyclone_storm', weatherData.windSpeed);
        disruptions.push({
          type: 'cyclone_storm',
          reading: weatherData.windSpeed,
          unit: 'km/hr',
          severity,
          source: 'OpenWeatherMap',
          affectedZones: allZones
        });
      }

      // Step 6: Check AQI
      if (aqiData.aqi >= THRESHOLDS.severe_pollution.value) {
        const severity = determineSeverity('severe_pollution', aqiData.aqi);
        disruptions.push({
          type: 'severe_pollution',
          reading: aqiData.aqi,
          unit: 'AQI',
          severity,
          source: 'OpenAQ',
          affectedZones: allZones
        });
      }

      // Step 7-15: Process each triggered disruption
      if (disruptions.length === 0) {
      } else {

        let totalClaims = 0;
        let totalPayouts = 0;
        let totalPayoutAmount = 0;

        for (const disruption of disruptions) {
          // Check for recent similar event (avoid duplicates within 2 hours)
          const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
          const recentEvent = await DisruptionEvent.findOne({
            type: disruption.type,
            timestamp: { $gte: twoHoursAgo }
          });

          if (recentEvent) {
            continue;
          }

          // Create DisruptionEvent
          const event = await DisruptionEvent.create({
            type: disruption.type,
            city: 'Bhubaneswar',
            affectedZones: disruption.affectedZones,
            reading: disruption.reading,
            unit: disruption.unit,
            severity: disruption.severity,
            source: disruption.source
          });

          // Auto-create claims
          // Adding required fraud check pipeline logic for reporting
          const affectedWorkers = await Worker.find({ 'zone.area': { $in: event.affectedZones } });
          const activePolicies = await Policy.find({ workerId: { $in: affectedWorkers.map(w => w._id) }, status: 'active' });
          for (const worker of affectedWorkers) {
            const policy = activePolicies.find(p => p.workerId.toString() === worker._id.toString());
            if (policy) {
              const tempClaim = { triggerType: event.type };
              const fResult = await runAllFraudChecks(worker, policy, tempClaim, event);
            }
          }
          const result = await autoCreateClaims(event);
          totalClaims += result.claimsCreated;
          totalPayouts += result.payoutsProcessed;
          totalPayoutAmount += result.totalPayoutAmount;
        }

      }

    } catch (error) {
      console.error(`[${timestamp}] ❌ Trigger monitor error:`, error.message);
    }

  });
};

module.exports = { startTriggerMonitor };
