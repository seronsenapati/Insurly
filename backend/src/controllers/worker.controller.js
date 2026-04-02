const Worker = require('../models/Worker.model');
const { generateRiskProfile } = require('../services/gemini.service');

/**
 * @desc Get worker profile
 * @route GET /api/worker/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user._id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, data: worker });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update worker profile
 * @route PUT /api/worker/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'phone', 'zone', 'avgWeeklyEarnings', 'workingDaysPerWeek', 'workingHoursPerDay', 'upiId'];
    const updates = {};

    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const worker = await Worker.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.json({ success: true, data: worker, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get worker risk profile (regenerate with Gemini)
 * @route GET /api/worker/risk-profile
 */
const getRiskProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user._id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const riskResult = await generateRiskProfile({
      name: worker.name,
      platform: worker.platform,
      zone: worker.zone,
      avgWeeklyEarnings: worker.avgWeeklyEarnings,
      workingDaysPerWeek: worker.workingDaysPerWeek,
      workingHoursPerDay: worker.workingHoursPerDay
    });

    worker.riskScore = riskResult.riskScore;
    worker.riskProfile = riskResult.riskProfile;
    await worker.save();

    res.json({
      success: true,
      data: {
        riskScore: worker.riskScore,
        riskProfile: worker.riskProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getRiskProfile };
