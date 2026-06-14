const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateBlog, handleValidationErrors } = require('../utils/validation');

router.post('/', authMiddleware, upload.single('cover_image'), validateBlog, handleValidationErrors, blogController.createBlog);
router.get('/', authMiddleware, blogController.getBlogs);
router.get('/:id', authMiddleware, blogController.getBlogById);
router.put('/:id', authMiddleware, upload.single('cover_image'), blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
