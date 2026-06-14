const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateRegister, validateLogin, handleValidationErrors } = require('../utils/validation');

router.post('/register', upload.single('profile_pic'), validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;