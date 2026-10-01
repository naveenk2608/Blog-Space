const { body, validationResult } = require('express-validator');

// Usernames appear in profile URLs, so keep them to URL-safe characters
const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;
const USERNAME_MSG = 'Username must be 3-30 characters: letters, numbers and underscores only';

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('username').notEmpty().withMessage('Username is required').bail()
    .matches(USERNAME_REGEX).withMessage(USERNAME_MSG),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('emailOrUsername').notEmpty().withMessage('Email/Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateBlog = [
  body('title').notEmpty({ ignore_whitespace: true }).withMessage('Title is required'),
  body('content').notEmpty({ ignore_whitespace: true }).withMessage('Content is required'),
  body('status').optional().trim().toLowerCase()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published')
];

const validateComment = [
  body('content').notEmpty({ ignore_whitespace: true }).withMessage('Comment content is required')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  USERNAME_REGEX,
  USERNAME_MSG,
  validateRegister,
  validateLogin,
  validateBlog,
  validateComment,
  handleValidationErrors
};
