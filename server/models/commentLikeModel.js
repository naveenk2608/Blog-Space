const pool = require('../config/db');

const toggleLike = async (commentId, userId) => {
  const [existing] = await pool.execute(
    'SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?',
    [commentId, userId]
  );
  if (existing.length > 0) {
    await pool.execute('DELETE FROM comment_likes WHERE id = ?', [existing[0].id]);
    return { liked: false };
  } else {
    try {
      await pool.execute(
        'INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)',
        [commentId, userId]
      );
    } catch (err) {
      // A simultaneous request (e.g. a double-click) already added this like
      if (err.code !== 'ER_DUP_ENTRY') throw err;
    }
    return { liked: true };
  }
};

const getLikeCount = async (commentId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?',
    [commentId]
  );
  return rows[0].count;
};

module.exports = {
  toggleLike,
  getLikeCount
};