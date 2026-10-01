const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateComment, handleValidationErrors } = require('../utils/validation');

router.post('/blog/:blogId', requireAuth, validateComment, handleValidationErrors, commentController.addComment);
router.put('/:id', requireAuth, validateComment, handleValidationErrors, commentController.updateComment);
router.delete('/:id', requireAuth, commentController.deleteComment);

module.exports = router;