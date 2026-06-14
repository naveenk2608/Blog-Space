const userModel = require('../models/userModel');
const blogModel = require('../models/blogModel');

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const stats = await userModel.getUserStats(user.id);
    const blogs = await blogModel.getBlogsByUserId(user.id, 'all');
    res.json({ user, stats, blogs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, bio } = req.body;
    const profile_pic = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Check if username is being changed and if it's already taken
    if (username) {
      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    const updates = {};
    if (name !== undefined && name !== '') updates.name = name;
    if (username !== undefined && username !== '') updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (profile_pic !== undefined) updates.profile_pic = profile_pic;

    // If no fields to update, return current user
    if (Object.keys(updates).length === 0) {
      const user = await userModel.findUserById(userId);
      return res.json(user);
    }

    const updated = await userModel.updateUser(userId, updates);
    if (!updated) {
      return res.status(400).json({ msg: 'Update failed' });
    }

    const user = await userModel.findUserById(userId);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const updated = await userModel.updateUser(userId, { profile_pic: null });
    if (!updated) {
      return res.status(400).json({ msg: 'Delete failed' });
    }

    const user = await userModel.findUserById(userId);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ msg: 'Username is required', available: false });
    }

    const userId = req.user?.id; // Get current user ID if logged in
    
    const existingUser = await userModel.findUserByUsername(username);
    
    // If no user exists with this username, it's available
    // If user exists but is the current user, it's also available (they can keep their username)
    if (!existingUser || (userId && existingUser.id === userId)) {
      return res.json({ available: true, username });
    }
    
    res.json({ available: false, username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfilePicture,
  checkUsernameAvailability
};
