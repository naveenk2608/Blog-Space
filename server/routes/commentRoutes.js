const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateComment, handleValidationErrors } = require('../utils/validation');

router.post('/blog/:blogId', authMiddleware, validateComment, handleValidationErrors, commentController.addComment);
router.put('/:id', authMiddleware, validateComment, handleValidationErrors, commentController.updateComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;