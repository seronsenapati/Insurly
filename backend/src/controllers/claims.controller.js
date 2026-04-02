const Claim = require('../models/Claim.model');
const Payout = require('../models/Payout.model');
const { processPayout } = require('../services/payout.service');
const Worker = require('../models/Worker.model');

/**
 * @desc Get all claims for logged in worker
 * @route GET /api/claims/my-claims
 */
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ workerId: req.user._id })
      .populate('policyId', 'tier maxWeeklyPayout')
      .populate('disruptionEventId', 'type reading unit severity source')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: claims });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single claim with full fraud analysis
 * @route GET /api/claims/:id
 */
const getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('workerId', 'name email platform zone avgWeeklyEarnings')
      .populate('policyId', 'tier weeklyPremium maxWeeklyPayout')
      .populate('disruptionEventId');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    res.json({ success: true, data: claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Admin get all claims with optional filters
 * @route GET /api/admin/claims
 */
const getAllClaims = async (req, res, next) => {
  try {
    const { status, minFraudScore, maxFraudScore, triggerType, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (triggerType) query.triggerType = triggerType;
    if (minFraudScore || maxFraudScore) {
      query.fraudScore = {};
      if (minFraudScore) query.fraudScore.$gte = parseInt(minFraudScore);
      if (maxFraudScore) query.fraudScore.$lte = parseInt(maxFraudScore);
    }

    const claims = await Claim.find(query)
      .populate('workerId', 'name email platform zone')
      .populate('policyId', 'tier maxWeeklyPayout')
      .populate('disruptionEventId', 'type reading unit severity')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Claim.countDocuments(query);

    res.json({
      success: true,
      data: claims,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Admin manually approve or reject a flagged claim
 * @route PUT /api/admin/claims/:id/review
 */
const reviewClaim = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approve or reject' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    if (claim.status === 'paid' || claim.status === 'rejected') {
      return res.status(400).json({ success: false, message: `Claim already ${claim.status}` });
    }

    if (action === 'reject') {
      claim.status = 'rejected';
      claim.processedAt = new Date();
      await claim.save();

      return res.json({ success: true, data: claim, message: 'Claim rejected' });
    }

    // Approve: process payout
    const worker = await Worker.findById(claim.workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    try {
      const payoutResult = await processPayout(
        worker._id.toString(),
        claim.payoutAmount,
        worker.upiId || 'default@upi'
      );

      await Payout.create({
        workerId: worker._id,
        claimId: claim._id,
        amount: claim.payoutAmount,
        upiId: worker.upiId || 'default@upi',
        transactionId: payoutResult.transactionId,
        status: 'completed',
        processedAt: payoutResult.processedAt
      });

      claim.status = 'paid';
      claim.processedAt = new Date();
      await claim.save();

      res.json({ success: true, data: claim, message: `Claim approved — Rs ${claim.payoutAmount} paid to ${worker.name}` });
    } catch (payoutError) {
      return res.status(500).json({ success: false, message: `Payout failed: ${payoutError.message}` });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyClaims, getClaimById, getAllClaims, reviewClaim };
