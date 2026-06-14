const pool = require('../config/db');

const toggleLike = async (blogId, userId) => {
  // Check if like exists
  const [existing] = await pool.execute(
    'SELECT id FROM blog_likes WHERE blog_id = ? AND user_id = ?',
    [blogId, userId]
  );
  if (existing.length > 0) {
    // Unlike
    await pool.execute('DELETE FROM blog_likes WHERE id = ?', [existing[0].id]);
    return { liked: false };
  } else {
    // Like
    await pool.execute(
      'INSERT INTO blog_likes (blog_id, user_id) VALUES (?, ?)',
      [blogId, userId]
    );
    return { liked: true };
  }
};

const getLikeCount = async (blogId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM blog_likes WHERE blog_id = ?',
    [blogId]
  );
  return rows[0].count;
};

const hasUserLiked = async (blogId, userId) => {
  const [rows] = await pool.execute(
    'SELECT id FROM blog_likes WHERE blog_id = ? AND user_id = ?',
    [blogId, userId]
  );
  return rows.length > 0;
};

module.exports = {
  toggleLike,
  getLikeCount,
  hasUserLiked
};