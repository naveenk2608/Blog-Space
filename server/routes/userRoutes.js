const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

// Important: specific routes must come before parameterized routes
router.put('/profile', requireAuth, uploadImage('profile_pic'), userController.updateProfile);
router.delete('/profile-picture', requireAuth, userController.deleteProfilePicture);
router.get('/check-username', optionalAuth, userController.checkUsernameAvailability);
router.get('/:username', optionalAuth, userController.getProfile);

module.exports = router;
