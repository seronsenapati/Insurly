const express = require('express');
const router = express.Router();
const { getMyClaims, getClaimById, getAllClaims, reviewClaim } = require('../controllers/claims.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/my-claims', protect, getMyClaims);
router.get('/:id', protect, getClaimById);

module.exports = router;
