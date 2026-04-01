const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getRiskProfile } = require('../controllers/worker.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/risk-profile', protect, getRiskProfile);

module.exports = router;
