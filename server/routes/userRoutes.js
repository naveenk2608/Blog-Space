const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Important: specific routes must come before parameterized routes
router.put('/profile', authMiddleware, upload.single('profile_pic'), userController.updateProfile);
router.delete('/profile-picture', authMiddleware, userController.deleteProfilePicture);
router.get('/check-username', userController.checkUsernameAvailability);
router.get('/:username', userController.getProfile);

module.exports = router;
