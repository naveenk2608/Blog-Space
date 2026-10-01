const blogLikeModel = require('../models/blogLikeModel');
const commentLikeModel = require('../models/commentLikeModel');
const blogModel = require('../models/blogModel');
const commentModel = require('../models/commentModel');
const { canViewBlog } = require('../utils/blogAccess');

const toggleBlogLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await blogModel.getBlogById(blogId);
    if (!blog || !canViewBlog(blog, req.user)) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    const result = await blogLikeModel.toggleLike(blogId, req.user.id);
    const likeCount = await blogLikeModel.getLikeCount(blogId);

    res.json({ liked: result.liked, likeCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await commentModel.findCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Comments on a draft are hidden along with the draft
    const blog = await blogModel.getBlogById(comment.blog_id);
    if (!blog || !canViewBlog(blog, req.user)) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const result = await commentLikeModel.toggleLike(commentId, req.user.id);
    const likeCount = await commentLikeModel.getLikeCount(commentId);

    res.json({ liked: result.liked, likeCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  toggleBlogLike,
  toggleCommentLike
};