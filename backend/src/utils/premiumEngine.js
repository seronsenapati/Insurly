const { calculatePremiumMultiplier, getSeasonIndex, ZONE_RISK_SCORES } = require('../services/brainjs.service');
const { getWeatherForecastFactor } = require('../services/weather.service');

/** Premium tier configurations */
const TIER_CONFIG = {
  basic: { basePremium: 29, maxWeeklyPayout: 500 },
  standard: { basePremium: 59, maxWeeklyPayout: 1100 },
  premium: { basePremium: 99, maxWeeklyPayout: 2000 }
};

/**
 * Calculate premium quotes for all 3 tiers
 * @param {{ zone: { area: string }, avgWeeklyEarnings: number, platform: string, claimCount: number }} workerData
 * @returns {Promise<Array<{ tier: string, weeklyPremium: number, maxWeeklyPayout: number, basePremium: number, premiumBreakdown: Object, activeTriggers: string[] }>>}
 */
const calculatePremiumQuotes = async (workerData) => {
  const zoneRisk = ZONE_RISK_SCORES[workerData.zone?.area] || 0.5;
  const normalizedEarnings = Math.min(workerData.avgWeeklyEarnings / 4000, 1);
  const seasonIndex = getSeasonIndex();
  const claimHistoryRatio = Math.min((workerData.claimCount || 0) / 10, 1);
  const platformRisk = 0.5; // Both platforms equal

  // Get weather forecast factor
  let weatherForecastFactor;
  try {
    weatherForecastFactor = await getWeatherForecastFactor();
  } catch {
    weatherForecastFactor = 1.0;
  }

  // Calculate neural network multiplier
  const nnMultiplier = calculatePremiumMultiplier({
    zoneRisk,
    avgEarnings: normalizedEarnings,
    rainProb: Math.max(0, (weatherForecastFactor - 0.9) / 0.5),
    maxTemp: seasonIndex > 0.5 ? 0.6 : 0.3,
    seasonIndex,
    claimHistory: claimHistoryRatio,
    platformRisk
  });

  // Calculate zone risk factor (0.8 to 1.3)
  const zoneRiskFactor = 0.8 + (zoneRisk * 0.5);

  // Calculate history factor (0.85 to 1.1)
  const historyFactor = claimHistoryRatio > 0.5 ? 1.1 : (claimHistoryRatio > 0.2 ? 1.0 : 0.85);

  const activeTriggers = ['heavy_rain', 'extreme_heat', 'cyclone_storm', 'severe_pollution', 'zone_lockdown'];

  const quotes = Object.entries(TIER_CONFIG).map(([tier, config]) => {
    const finalPremium = Math.round(
      config.basePremium * zoneRiskFactor * weatherForecastFactor * historyFactor
    );

    return {
      tier,
      weeklyPremium: finalPremium,
      maxWeeklyPayout: config.maxWeeklyPayout,
      basePremium: config.basePremium,
      premiumBreakdown: {
        basePremium: config.basePremium,
        zoneRiskFactor: parseFloat(zoneRiskFactor.toFixed(2)),
        weatherForecastFactor: parseFloat(weatherForecastFactor.toFixed(2)),
        historyFactor: parseFloat(historyFactor.toFixed(2)),
        nnMultiplier: nnMultiplier
      },
      activeTriggers
    };
  });

  return quotes;
};

module.exports = {
  calculatePremiumQuotes,
  TIER_CONFIG
};
