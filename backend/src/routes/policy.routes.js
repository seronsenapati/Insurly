const express = require('express');
const router = express.Router();
const { getQuote, purchasePolicy, getActivePolicy, getPolicyHistory, getPolicyById } = require('../controllers/policy.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/quote', protect, getQuote);
router.post('/purchase', protect, purchasePolicy);
router.get('/active', protect, getActivePolicy);
router.get('/history', protect, getPolicyHistory);
router.get('/:id', protect, getPolicyById);

module.exports = router;
