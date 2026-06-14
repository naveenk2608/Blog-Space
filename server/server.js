const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// Global error handler (so Multer/upload errors don't turn into generic 500s)
app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_UNSUPPORTED_TYPE') {
    return res.status(400).json({ msg: err.message || 'This file type is not supported' });
  }

  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ msg: 'File too large. Max size is 5MB.' });
  }

  console.error(err);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
