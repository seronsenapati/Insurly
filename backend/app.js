const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const errorHandler = require('./src/middleware/errorHandler.middleware');

const authRoutes = require('./src/routes/auth.routes');
const workerRoutes = require('./src/routes/worker.routes');
const policyRoutes = require('./src/routes/policy.routes');
const claimsRoutes = require('./src/routes/claims.routes');
const triggersRoutes = require('./src/routes/triggers.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const payoutRoutes = require('./src/routes/payout.routes');

// Admin claims routes (separate from worker claims)
const { getAllClaims, reviewClaim } = require('./src/controllers/claims.controller');
const { protect, adminOnly } = require('./src/middleware/auth.middleware');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Insurly API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/triggers', triggersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payout', payoutRoutes);

// Admin claims routes (mounted separately per spec)
app.get('/api/admin/claims', protect, adminOnly, getAllClaims);
app.put('/api/admin/claims/:id/review', protect, adminOnly, reviewClaim);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
