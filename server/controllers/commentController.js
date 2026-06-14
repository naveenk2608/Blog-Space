const commentModel = require('../models/commentModel');
const blogModel = require('../models/blogModel');

const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    const blog = await blogModel.getBlogById(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    const commentId = await commentModel.createComment({
      blog_id: blogId,
      user_id: req.user.id,
      content
    });

    res.json({ commentId, msg: 'Comment added' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await commentModel.findCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const { content } = req.body;
    await commentModel.updateComment(req.params.id, content);
    res.json({ msg: 'Comment updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await commentModel.findCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await commentModel.deleteComment(req.params.id);
    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment
};