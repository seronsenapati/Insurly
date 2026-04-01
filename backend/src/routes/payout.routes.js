const express = require('express');
const router = express.Router();
const { processPayout, getPayoutHistory } = require('../controllers/payout.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/process/:claimId', protect, processPayout);
router.get('/history', protect, getPayoutHistory);

module.exports = router;
