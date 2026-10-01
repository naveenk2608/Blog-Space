const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');
const { uploadImage } = require('../middleware/uploadMiddleware');
const { validateRegister, validateLogin, handleValidationErrors } = require('../utils/validation');

router.post('/register', uploadImage('profile_pic'), validateRegister, handleValidationErrors, authController.register);
router.post('/login', loginLimiter, validateLogin, handleValidationErrors, authController.login);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;