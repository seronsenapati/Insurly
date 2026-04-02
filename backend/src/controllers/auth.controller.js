const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const Worker = require('../models/Worker.model');
const Admin = require('../models/Admin.model');
const { generateRiskProfile } = require('../services/gemini.service');

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateToken = (id, role = 'worker') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @desc Register a new worker
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, platform, zone, avgWeeklyEarnings, workingDaysPerWeek, workingHoursPerDay, upiId } = req.body;

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ $or: [{ email }, { phone }] });
    if (existingWorker) {
      return res.status(400).json({ success: false, message: 'Worker with this email or phone already exists' });
    }

    // Create worker
    const worker = await Worker.create({
      name, phone, email, password, platform, zone,
      avgWeeklyEarnings, workingDaysPerWeek: workingDaysPerWeek || 6,
      workingHoursPerDay: workingHoursPerDay || 10, upiId
    });

    // Generate Gemini risk profile
    try {
      const riskResult = await generateRiskProfile({
        name, platform, zone, avgWeeklyEarnings,
        workingDaysPerWeek: workingDaysPerWeek || 6,
        workingHoursPerDay: workingHoursPerDay || 10
      });
      worker.riskScore = riskResult.riskScore;
      worker.riskProfile = riskResult.riskProfile;
      await worker.save();
    } catch (riskError) {
      console.error('Risk profile generation error:', riskError.message);
    }

    const token = generateToken(worker._id, 'worker');

    res.status(201).json({
      success: true,
      data: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        platform: worker.platform,
        zone: worker.zone,
        riskScore: worker.riskScore,
        riskProfile: worker.riskProfile,
        role: 'worker',
        token
      },
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Login worker
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email }).select('+password');
    if (!worker) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await worker.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(worker._id, 'worker');

    res.json({
      success: true,
      data: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        platform: worker.platform,
        zone: worker.zone,
        role: 'worker',
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Login admin
 * @route POST /api/auth/admin/login
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateToken(admin._id, 'admin');

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        token
      },
      message: 'Admin login successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get current user profile
 * @route GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        role: req.userRole || user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/** Validation rules for registration */
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('platform').isIn(['zomato', 'swiggy']).withMessage('Platform must be zomato or swiggy'),
  body('avgWeeklyEarnings').isNumeric().withMessage('Average weekly earnings is required')
];

/** Validation rules for login */
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
  register, login, adminLogin, getMe,
  registerValidation, loginValidation
};
