const blogModel = require('../models/blogModel');
const commentModel = require('../models/commentModel');
const blogLikeModel = require('../models/blogLikeModel');
const { canViewBlog } = require('../utils/blogAccess');

const createBlog = async (req, res) => {
  try {
    // status is already validated and normalized by validateBlog
    const { title, content, status } = req.body;
    const cover_image = req.file ? req.file.path : null;

    const blogId = await blogModel.createBlog({
      user_id: req.user.id,
      title,
      content,
      cover_image,
      status
    });

    res.json({ blogId, msg: 'Blog created' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getBlogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    // likedByUser is worked out in the same query
    const blogs = await blogModel.getBlogs(limit, offset, 'published', req.user?.id);

    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogModel.getBlogById(req.params.id);
    // Other users get the same 404 for a draft as for a missing blog
    if (!blog || !canViewBlog(blog, req.user)) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    // Get comments with like counts, user info and whether the current user liked each one
    const comments = await commentModel.getCommentsByBlogId(blog.id, req.user?.id);

    // Check if current user liked the blog
    if (req.user) {
      blog.likedByUser = await blogLikeModel.hasUserLiked(blog.id, req.user.id);
    }

    res.json({ blog, comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await blogModel.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.user_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const { title, content, status } = req.body;
   const cover_image = req.file ? req.file.path : null;

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (cover_image) updates.cover_image = cover_image;
    if (status !== undefined) updates.status = status;

    const updated = await blogModel.updateBlog(req.params.id, updates);
    if (!updated) {
      return res.status(400).json({ msg: 'Update failed' });
    }

    res.json({ msg: 'Blog updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.user_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await blogModel.deleteBlog(req.params.id);
    res.json({ msg: 'Blog deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
};

