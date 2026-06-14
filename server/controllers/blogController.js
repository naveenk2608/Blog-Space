const blogModel = require('../models/blogModel');
const commentModel = require('../models/commentModel');
const blogLikeModel = require('../models/blogLikeModel');
const commentLikeModel = require('../models/commentLikeModel'); // for comments in detail

const normalizeStatus = (status) => {
  if (typeof status !== 'string') return status;
  const s = status.trim().toLowerCase();
  // only allow known values; otherwise keep as-is
  if (s === 'draft' || s === 'published') return s;
  return s;
};

const createBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const cover_image = req.file ? `/uploads/${req.file.filename}` : null;

    const blogId = await blogModel.createBlog({
      user_id: req.user.id,
      title,
      content,
      cover_image,
      status: normalizeStatus(status)
    });

    res.json({ blogId, msg: 'Blog created' });
  } catch (err) {
    console.error(err);

    // Multer/upload errors (e.g., unsupported file type)
    if (err && err.code === 'LIMIT_UNSUPPORTED_TYPE') {
      return res.status(400).json({ msg:  'This file type is not supported' });
    }

    res.status(500).send('Server error');
  }
};

const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const blogs = await blogModel.getBlogs(limit, offset, 'published');

    // Add likedByUser status for each blog if user is authenticated
    if (req.user) {
      for (let blog of blogs) {
        blog.likedByUser = await blogLikeModel.hasUserLiked(blog.id, req.user.id);
      }
    }

    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogModel.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    // Get comments with like counts and user info
    const comments = await commentModel.getCommentsByBlogId(blog.id);

    // For each comment, check if current user liked it (if authenticated)
    if (req.user) {
      for (let comment of comments) {
        comment.likedByUser = await commentLikeModel.hasUserLiked(comment.id, req.user.id);
      }
    }

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
    const cover_image = req.file ? `/uploads/${req.file.filename}` : null;

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (cover_image) updates.cover_image = cover_image;
    if (status !== undefined) updates.status = normalizeStatus(status);

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

