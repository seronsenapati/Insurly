const express = require('express');
const router = express.Router();
const { getAdminOverview, getZoneRisk, getLossRatio, getPredictions, getWorkerSummary } = require('../controllers/analytics.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/admin/overview', protect, adminOnly, getAdminOverview);
router.get('/admin/zone-risk', protect, adminOnly, getZoneRisk);
router.get('/admin/loss-ratio', protect, adminOnly, getLossRatio);
router.get('/admin/predictions', protect, adminOnly, getPredictions);
router.get('/worker/summary', protect, getWorkerSummary);

module.exports = router;
