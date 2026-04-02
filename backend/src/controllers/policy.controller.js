const Policy = require('../models/Policy.model');
const Worker = require('../models/Worker.model');
const Claim = require('../models/Claim.model');
const { calculatePremiumQuotes, TIER_CONFIG } = require('../utils/premiumEngine');
const { processPayment } = require('../services/payout.service');

/**
 * @desc Get premium quotes for all 3 tiers
 * @route POST /api/policy/quote
 */
const getQuote = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user._id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const claimCount = await Claim.countDocuments({ workerId: worker._id });
    const quotes = await calculatePremiumQuotes({ ...worker.toObject(), claimCount });

    res.json({ success: true, data: quotes });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Purchase a weekly policy
 * @route POST /api/policy/purchase
 */
const purchasePolicy = async (req, res, next) => {
  try {
    const { tier } = req.body;

    if (!['basic', 'standard', 'premium'].includes(tier)) {
      return res.status(400).json({ success: false, message: 'Invalid tier — must be basic, standard, or premium' });
    }

    const worker = await Worker.findById(req.user._id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Check for existing active policy
    const activePolicy = await Policy.findOne({
      workerId: worker._id,
      status: 'active',
      endDate: { $gte: new Date() }
    });
    if (activePolicy) {
      return res.status(400).json({ success: false, message: 'You already have an active policy. Wait for it to expire or cancel it first.' });
    }

    // Calculate premium
    const claimCount = await Claim.countDocuments({ workerId: worker._id });
    const quotes = await calculatePremiumQuotes({ ...worker.toObject(), claimCount });
    const selectedQuote = quotes.find(q => q.tier === tier);

    if (!selectedQuote) {
      return res.status(500).json({ success: false, message: 'Failed to calculate premium' });
    }

    // Process mock payment
    let paymentResult;
    try {
      paymentResult = await processPayment(worker._id.toString(), selectedQuote.weeklyPremium);
    } catch (payErr) {
      return res.status(500).json({ success: false, message: payErr.message });
    }

    // Create policy
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const policy = await Policy.create({
      workerId: worker._id,
      tier,
      weeklyPremium: selectedQuote.weeklyPremium,
      maxWeeklyPayout: selectedQuote.maxWeeklyPayout,
      activeTriggers: selectedQuote.activeTriggers,
      status: 'active',
      startDate,
      endDate,
      premiumBreakdown: selectedQuote.premiumBreakdown,
      transactionId: paymentResult.transactionId
    });

    res.status(201).json({
      success: true,
      data: policy,
      message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} policy activated! Coverage starts now.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get active policy for current worker
 * @route GET /api/policy/active
 */
const getActivePolicy = async (req, res, next) => {
  try {
    const policy = await Policy.findOne({
      workerId: req.user._id,
      status: 'active',
      endDate: { $gte: new Date() }
    });

    if (!policy) {
      return res.json({ success: true, data: null, message: 'No active policy found' });
    }

    res.json({ success: true, data: policy });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get policy history for current worker
 * @route GET /api/policy/history
 */
const getPolicyHistory = async (req, res, next) => {
  try {
    const policies = await Policy.find({ workerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: policies });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get specific policy by ID
 * @route GET /api/policy/:id
 */
const getPolicyById = async (req, res, next) => {
  try {
    const policy = await Policy.findById(req.params.id).populate('workerId', 'name email platform zone');
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }
    res.json({ success: true, data: policy });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuote, purchasePolicy, getActivePolicy, getPolicyHistory, getPolicyById };
