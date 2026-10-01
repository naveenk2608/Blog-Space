const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/blog/:blogId', requireAuth, likeController.toggleBlogLike);
router.post('/comment/:commentId', requireAuth, likeController.toggleCommentLike);

module.exports = router;