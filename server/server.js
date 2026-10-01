const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Login tokens can't be signed without a secret, so fail at startup instead of on every login
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not set');
  process.exit(1);
}

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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

  // Other Multer errors, e.g. a file sent under an unexpected field name
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: err.message });
  }

  // Cloudinary rejected the file (e.g. a corrupt or disguised image)
  if (err && err.http_code === 400) {
    return res.status(400).json({ msg: 'This image could not be uploaded. Please try a different file.' });
  }

  console.error(err);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
