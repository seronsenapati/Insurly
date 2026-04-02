const mongoose = require('mongoose');

/**
 * Claim schema for parametric insurance claims
 * Auto-generated when disruption events cross thresholds
 */
const claimSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  },
  disruptionEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DisruptionEvent',
    required: true
  },
  triggerType: {
    type: String,
    enum: ['heavy_rain', 'extreme_heat', 'cyclone_storm', 'severe_pollution', 'zone_lockdown'],
    required: true
  },
  triggerValue: {
    type: Number,
    required: true
  },
  triggerThreshold: {
    type: Number,
    required: true
  },
  disruptionSeverity: {
    type: String,
    enum: ['full_day', 'half_day', 'partial'],
    required: true
  },
  payoutAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['auto_approved', 'conditionally_approved', 'flagged_fraud', 'paid', 'rejected', 'under_review'],
    default: 'under_review'
  },
  fraudScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  fraudReasons: [{
    type: String
  }],
  fraudAnalysis: {
    type: String,
    default: ''
  },
  autoProcessed: {
    type: Boolean,
    default: false
  },
  processedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Claim', claimSchema);
