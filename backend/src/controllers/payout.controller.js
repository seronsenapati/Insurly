const Payout = require('../models/Payout.model');
const Claim = require('../models/Claim.model');
const Worker = require('../models/Worker.model');
const { processPayout: processPayoutService } = require('../services/payout.service');

/**
 * @desc Process mock payout for an approved claim
 * @route POST /api/payout/process/:claimId
 */
const processPayout = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.claimId);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    if (claim.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Claim already paid' });
    }

    if (!['auto_approved', 'conditionally_approved'].includes(claim.status)) {
      return res.status(400).json({ success: false, message: 'Claim is not approved for payout' });
    }

    const worker = await Worker.findById(claim.workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const payoutResult = await processPayoutService(
      worker._id.toString(),
      claim.payoutAmount,
      worker.upiId || 'default@upi'
    );

    const payout = await Payout.create({
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

    res.json({
      success: true,
      data: payout,
      message: `Payout of Rs ${claim.payoutAmount} processed successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get payout history for current worker
 * @route GET /api/payout/history
 */
const getPayoutHistory = async (req, res, next) => {
  try {
    const payouts = await Payout.find({ workerId: req.user._id })
      .populate('claimId', 'triggerType disruptionSeverity payoutAmount')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payouts });
  } catch (error) {
    next(error);
  }
};

module.exports = { processPayout, getPayoutHistory };
