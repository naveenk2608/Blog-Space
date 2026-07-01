const pool = require('../config/db');

const createUser = async (user) => {
  const { name, username, email, password, profile_pic } = user;
  const [result] = await pool.execute(
    'INSERT INTO users (name, username, email, password, profile_pic) VALUES (?, ?, ?, ?, ?)',
    [name, username, email, password, profile_pic]
  );
  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findUserByUsername = async (username) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await pool.execute('SELECT id, name, username, email, profile_pic, bio, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

const updateUser = async (id, updates) => {
  const { name, username, bio, profile_pic } = updates;
  
  // Build the SET part of the query
  const setClauses = [];
  const params = [];
  
  if (name !== undefined) {
    setClauses.push('name = ?');
    params.push(name);
  }
  if (username !== undefined) {
    setClauses.push('username = ?');
    params.push(username);
  }
  if (bio !== undefined) {
    setClauses.push('bio = ?');
    params.push(bio);
  }
  if (profile_pic !== undefined) {
    setClauses.push('profile_pic = ?');
    params.push(profile_pic);
  }
  
  // If no fields to update, return false
  if (setClauses.length === 0) {
    return false;
  }
  
  const query = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
  params.push(id);
  
  const [result] = await pool.execute(query, params);
  return result.affectedRows > 0;
};

const getUserStats = async (userId) => {
  // blogs count (published only)
  const [blogsCountRows] = await pool.execute(
  'SELECT COUNT(*) as count FROM blogs WHERE user_id = ? AND status = ?',
  [userId, 'published']
);
  const blogsCount = blogsCountRows[0].count;

  // total likes received (on blogs and comments)
  const [likesReceivedRows] = await pool.execute(
    `SELECT 
      (SELECT COUNT(*) FROM blog_likes WHERE blog_id IN (SELECT id FROM blogs WHERE user_id = ?)) +
      (SELECT COUNT(*) FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE user_id = ?)) as total`,
    [userId, userId]
  );
  const totalLikesReceived = likesReceivedRows[0].total || 0;

  // total comments received (on blogs)
  const [commentsReceivedRows] = await pool.execute(
    'SELECT COUNT(*) as count FROM comments WHERE blog_id IN (SELECT id FROM blogs WHERE user_id = ?)',
    [userId]
  );
  const totalCommentsReceived = commentsReceivedRows[0].count;

  return {
    blogsCount,
    totalLikesReceived,
    totalCommentsReceived
  };
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  getUserStats
};
