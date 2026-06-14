const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/blog/:blogId', authMiddleware, likeController.toggleBlogLike);
router.post('/comment/:commentId', authMiddleware, likeController.toggleCommentLike);

module.exports = router;