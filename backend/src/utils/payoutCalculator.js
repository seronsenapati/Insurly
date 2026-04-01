/**
 * Severity multipliers for payout calculation
 */
const SEVERITY_MULTIPLIERS = {
  full_day: 1.0,
  half_day: 0.5,
  partial: 0.3
};

/**
 * Calculate payout amount for a claim
 * Formula: (avgWeeklyEarnings / workingDaysPerWeek) x severityMultiplier
 * Capped at policy maxWeeklyPayout
 * @param {number} avgWeeklyEarnings - Worker's average weekly earnings in INR
 * @param {number} workingDaysPerWeek - Worker's working days per week
 * @param {string} severity - Disruption severity: full_day | half_day | partial
 * @param {number} maxWeeklyPayout - Policy's maximum weekly payout cap in INR
 * @returns {number} Payout amount in INR
 */
const calculatePayout = (avgWeeklyEarnings, workingDaysPerWeek, severity, maxWeeklyPayout) => {
  const dailyAverage = avgWeeklyEarnings / (workingDaysPerWeek || 6);
  const multiplier = SEVERITY_MULTIPLIERS[severity] || 0.3;
  const rawPayout = dailyAverage * multiplier;

  // Cap at maxWeeklyPayout
  const finalPayout = Math.min(rawPayout, maxWeeklyPayout);

  return parseFloat(finalPayout.toFixed(2));
};

/**
 * Determine severity level based on trigger type and reading value
 * @param {string} triggerType - Type of disruption trigger
 * @param {number} reading - The measured value
 * @returns {string} Severity: full_day | half_day | partial
 */
const determineSeverity = (triggerType, reading) => {
  switch (triggerType) {
    case 'heavy_rain':
      if (reading > 50) return 'full_day';
      if (reading > 25) return 'half_day';
      return 'partial';

    case 'extreme_heat':
      if (reading > 47) return 'full_day';
      if (reading > 45) return 'half_day';
      return 'partial';

    case 'cyclone_storm':
      if (reading > 90) return 'full_day';
      return 'half_day';

    case 'severe_pollution':
      if (reading > 350) return 'half_day';
      return 'partial';

    case 'zone_lockdown':
      return 'full_day';

    default:
      return 'partial';
  }
};

module.exports = {
  calculatePayout,
  determineSeverity,
  SEVERITY_MULTIPLIERS
};
