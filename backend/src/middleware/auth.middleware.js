const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker.model');
const Admin = require('../models/Admin.model');

/**
 * Protect routes — verify JWT token and attach user to request
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find as worker first, then admin
    let user = await Worker.findById(decoded.id);
    if (user) {
      req.user = user;
      req.userRole = 'worker';
      return next();
    }

    user = await Admin.findById(decoded.id);
    if (user) {
      req.user = user;
      req.userRole = 'admin';
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized — user not found'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Not authorized — invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Not authorized — token expired' });
    }
    return res.status(500).json({ success: false, message: 'Authorization error' });
  }
};

/**
 * Admin-only route middleware — must be used after protect
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin' && req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden — admin access required'
    });
  }
  next();
};

module.exports = { protect, adminOnly };
