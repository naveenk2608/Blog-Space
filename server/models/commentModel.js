const pool = require('../config/db');

const createComment = async (comment) => {
  const { blog_id, user_id, content } = comment;
  const [result] = await pool.execute(
    'INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)',
    [blog_id, user_id, content]
  );
  return result.insertId;
};

const getCommentsByBlogId = async (blogId) => {
  const [rows] = await pool.execute(
    `SELECT c.*, u.name, u.username, u.profile_pic,
      (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likeCount
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.blog_id = ?
     ORDER BY c.created_at ASC`,
    [blogId]
  );
  return rows;
};

const updateComment = async (id, content) => {
  const [result] = await pool.execute(
    'UPDATE comments SET content = ? WHERE id = ?',
    [content, id]
  );
  return result.affectedRows > 0;
};

const deleteComment = async (id) => {
  const [result] = await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const findCommentById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM comments WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  createComment,
  getCommentsByBlogId,
  updateComment,
  deleteComment,
  findCommentById
};