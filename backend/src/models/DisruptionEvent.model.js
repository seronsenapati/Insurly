const mongoose = require('mongoose');

/**
 * Disruption Event schema for weather/AQI threshold breaches
 * Created automatically by triggerMonitor cron job or manually by admin
 */
const disruptionEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['heavy_rain', 'extreme_heat', 'cyclone_storm', 'severe_pollution', 'zone_lockdown'],
    required: true
  },
  city: {
    type: String,
    default: 'Bhubaneswar'
  },
  affectedZones: [{
    type: String
  }],
  reading: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['mm/hr', 'celsius', 'km/hr', 'AQI', 'manual'],
    required: true
  },
  severity: {
    type: String,
    enum: ['full_day', 'half_day', 'partial'],
    required: true
  },
  source: {
    type: String,
    enum: ['OpenWeatherMap', 'OpenAQ', 'Manual Admin'],
    required: true
  },
  affectedWorkerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  }],
  claimsTriggered: {
    type: Number,
    default: 0
  },
  totalPayoutTriggered: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DisruptionEvent', disruptionEventSchema);
