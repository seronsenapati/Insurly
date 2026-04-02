const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Worker schema for food delivery partners (Zomato/Swiggy)
 * Stores personal info, work details, zone, risk profile, and UPI
 */
const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\d{10}$/, 'Phone must be exactly 10 digits']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  platform: {
    type: String,
    enum: ['zomato', 'swiggy'],
    required: [true, 'Platform is required']
  },
  zone: {
    city: { type: String, default: 'Bhubaneswar' },
    pincode: { type: String },
    area: {
      type: String,
      enum: ['Patia', 'Nayapalli', 'Saheed Nagar', 'Khandagiri', 'Rasulgarh', 'Unit-4', 'Chandrasekharpur'],
      required: [true, 'Area is required']
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  avgWeeklyEarnings: {
    type: Number,
    required: [true, 'Average weekly earnings is required'],
    min: 0
  },
  workingDaysPerWeek: {
    type: Number,
    default: 6,
    min: 1,
    max: 7
  },
  workingHoursPerDay: {
    type: Number,
    default: 10,
    min: 1,
    max: 24
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  riskProfile: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'worker'
  },
  deliveryZones: [{ area: { type: String }, visitCount: { type: Number, default: 0 }, lastVisited: { type: Date } }],
  lastKnownLocation: { lat: { type: Number }, lng: { type: Number }, updatedAt: { type: Date } },
  fraudFlags: { type: Number, default: 0 },
  riskTier: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  deliveryZones: [{
    area: { type: String },
    visitCount: { type: Number, default: 0 },
    lastVisited: { type: Date }
  }],
  lastKnownLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date }
  },
  fraudFlags: { type: Number, default: 0 },
  riskTier: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Hash password before saving
 */
workerSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - The password to check
 * @returns {Promise<boolean>}
 */
workerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Worker', workerSchema);

