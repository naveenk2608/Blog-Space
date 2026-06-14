const pool = require('../config/db');

const createBlog = async (blog) => {
  const { user_id, title, content, cover_image, status } = blog;
  const [result] = await pool.execute(
    'INSERT INTO blogs (user_id, title, content, cover_image, status) VALUES (?, ?, ?, ?, ?)',
    [user_id, title, content, cover_image, status || 'draft']
  );
  return result.insertId;
};

// Change .execute to .query here
const getBlogs = async (limit, offset, status = 'published') => {
  // Use .query instead of .execute
  const [rows] = await pool.query(
    `SELECT b.*, u.name, u.username, u.profile_pic,
      (SELECT COUNT(*) FROM blog_likes WHERE blog_id = b.id) as likeCount,
      (SELECT COUNT(*) FROM comments WHERE blog_id = b.id) as commentCount
     FROM blogs b
     JOIN users u ON b.user_id = u.id
     WHERE b.status = ?
     ORDER BY b.created_at DESC
     LIMIT ? OFFSET ?`,
    [status, limit, offset]
  );
  return rows;
};

const getBlogById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT b.*, u.name, u.username, u.profile_pic,
      (SELECT COUNT(*) FROM blog_likes WHERE blog_id = b.id) as likeCount,
      (SELECT COUNT(*) FROM comments WHERE blog_id = b.id) as commentCount
     FROM blogs b
     JOIN users u ON b.user_id = u.id
     WHERE b.id = ?`,
    [id]
  );
  return rows[0];
};

const updateBlog = async (id, updates) => {
  const { title, content, cover_image, status } = updates;
  let query = 'UPDATE blogs SET ';
  const params = [];
  if (title) {
    query += 'title = ?, ';
    params.push(title);
  }
  if (content) {
    query += 'content = ?, ';
    params.push(content);
  }
  if (cover_image) {
    query += 'cover_image = ?, ';
    params.push(cover_image);
  }
  if (status) {
    query += 'status = ?, ';
    params.push(status);
  }
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  params.push(id);
  const [result] = await pool.execute(query, params);
  return result.affectedRows > 0;
};

const deleteBlog = async (id) => {
  const [result] = await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const getBlogsByUserId = async (userId, status = 'published') => {
  // status can be 'published' | 'draft' | 'all'
  // For 'all', don't filter by b.status
  const statusSql = status === 'all' ? '' : ' AND b.status = ?';
  const params = status === 'all' ? [userId] : [userId, status];

  const [rows] = await pool.execute(
    `SELECT b.*,
      (SELECT COUNT(*) FROM blog_likes WHERE blog_id = b.id) as likeCount,
      (SELECT COUNT(*) FROM comments WHERE blog_id = b.id) as commentCount
     FROM blogs b
     WHERE b.user_id = ?${statusSql}
     ORDER BY b.created_at DESC`,
    params
  );

  return rows;
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUserId
};

