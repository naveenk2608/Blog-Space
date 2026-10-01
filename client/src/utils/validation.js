// Keep in sync with server/utils/validation.js
export const USERNAME_PATTERN = '[A-Za-z0-9_]{3,30}';
export const USERNAME_HINT = 'Username must be 3-30 characters: letters, numbers and underscores only';

export const isValidUsername = (username) => new RegExp(`^${USERNAME_PATTERN}$`).test(username);

// Image types the server accepts for uploads
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp';
