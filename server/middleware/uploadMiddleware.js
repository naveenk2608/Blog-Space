const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog-space',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  // Reject unsupported files before they are sent to Cloudinary
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    const err = new Error('Only JPG, PNG, GIF and WebP images are allowed');
    err.code = 'LIMIT_UNSUPPORTED_TYPE';
    cb(err);
  },
});

const discardUpload = async (file) => {
  try {
    await cloudinary.uploader.destroy(file.filename);
  } catch (err) {
    console.error('Failed to delete unused upload:', err.message);
  }
};

// Multer uploads the image before the request is validated or authorized, so if the
// request then fails, delete the image instead of leaving it orphaned in Cloudinary
const uploadImage = (field) => [
  (req, res, next) => {
    res.on('finish', () => {
      if (req.file && res.statusCode >= 400) discardUpload(req.file);
    });
    next();
  },
  upload.single(field),
];

module.exports = { uploadImage };
