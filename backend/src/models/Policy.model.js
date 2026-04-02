const mongoose = require('mongoose');

/**
 * Policy schema for weekly parametric income insurance
 * Covers 3 tiers: basic, standard, premium
 */
const policySchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: [true, 'Worker ID is required']
  },
  tier: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: [true, 'Policy tier is required']
  },
  weeklyPremium: {
    type: Number,
    required: [true, 'Weekly premium is required'],
    min: 0
  },
  maxWeeklyPayout: {
    type: Number,
    required: true,
    min: 0
  },
  coverageMultipliers: {
    fullDay: { type: Number, default: 1.0 },
    halfDay: { type: Number, default: 0.5 },
    partial: { type: Number, default: 0.3 }
  },
  activeTriggers: [{
    type: String,
    enum: ['heavy_rain', 'extreme_heat', 'cyclone_storm', 'severe_pollution', 'zone_lockdown']
  }],
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  premiumBreakdown: {
    basePremium: { type: Number },
    zoneRiskFactor: { type: Number, min: 0.8, max: 1.3 },
    weatherForecastFactor: { type: Number, min: 0.9, max: 1.4 },
    historyFactor: { type: Number, min: 0.85, max: 1.1 }
  },
  transactionId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Set endDate to startDate + 7 days before saving
 */
policySchema.pre('save', function() {
  if (this.isNew && !this.endDate) {
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + 7);
    this.endDate = endDate;
  }
});

/**
 * Set maxWeeklyPayout based on tier if not explicitly set
 */
policySchema.pre('save', function() {
  if (this.isNew && !this.maxWeeklyPayout) {
    const tierPayouts = { basic: 500, standard: 1100, premium: 2000 };
    this.maxWeeklyPayout = tierPayouts[this.tier] || 500;
  }
});

module.exports = mongoose.model('Policy', policySchema);
