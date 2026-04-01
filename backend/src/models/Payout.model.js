const mongoose = require('mongoose');

/**
 * Payout schema for mock payment transactions
 * No real payment gateway — uses custom mock service
 */
const payoutSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  upiId: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'UPI'
  },
  bank: {
    type: String,
    default: 'Mock Bank'
  },
  status: {
    type: String,
    enum: ['initiated', 'processing', 'completed', 'failed'],
    default: 'initiated'
  },
  processedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payout', payoutSchema);
