const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe, registerValidation, loginValidation } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/admin/login', loginValidation, validate, adminLogin);
router.get('/me', protect, getMe);

module.exports = router;
