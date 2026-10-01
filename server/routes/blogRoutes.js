const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');
const { validateBlog, handleValidationErrors } = require('../utils/validation');

router.post('/', requireAuth, uploadImage('cover_image'), validateBlog, handleValidationErrors, blogController.createBlog);
router.get('/', optionalAuth, blogController.getBlogs);
router.get('/:id', optionalAuth, blogController.getBlogById);
router.put('/:id', requireAuth, uploadImage('cover_image'), validateBlog, handleValidationErrors, blogController.updateBlog);
router.delete('/:id', requireAuth, blogController.deleteBlog);

module.exports = router;
