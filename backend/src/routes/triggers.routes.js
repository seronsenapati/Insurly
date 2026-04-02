const express = require('express');
const router = express.Router();
const { getCurrentTriggers, getActiveDisruptions, fireManualTrigger, getDisruptionHistory } = require('../controllers/triggers.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/current', getCurrentTriggers);
router.get('/active', getActiveDisruptions);
router.post('/manual', protect, adminOnly, fireManualTrigger);
router.get('/history', protect, getDisruptionHistory);

module.exports = router;
