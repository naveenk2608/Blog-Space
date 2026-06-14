import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './styles/EditProfile.css';

const EditProfile = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    profile_pic: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingPic, setDeletingPic] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ checked: false, available: null });
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Base URL for images
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        profile_pic: user.profile_pic || null
      });
      if (user.profile_pic) {
      setPreview(getImagePath(user.profile_pic));
      // Also update the navbar/profile avatar immediately after selecting/saving.
      // Since AuthContext does not expose setUser, we force re-render by updating the preview state.
      // (Navbar uses AuthContext's `user`, so navigation/refetch will still be the source of truth.)
      }
    }
  }, [user]);

  const getImagePath = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL}${path}?t=${Date.now()}`;
    }
    return `${BASE_URL}/uploads/${path}?t=${Date.now()}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset username status when user starts typing
    if (name === 'username') {
      setUsernameStatus({ checked: false, available: null });
    }
  };

  // Debounced username check
  useEffect(() => {
    const checkUsername = async () => {
      const username = formData.username.trim();
      
      // Don't check if username is same as current user's username
      if (!username || username === user?.username) {
        setUsernameStatus({ checked: false, available: null });
        return;
      }

      // Only check if username is at least 3 characters
      if (username.length < 3) {
        setUsernameStatus({ checked: true, available: false });
        return;
      }

      setCheckingUsername(true);
      try {
        const res = await API.get(`/users/check-username?username=${encodeURIComponent(username)}`);
        setUsernameStatus({ checked: true, available: res.data.available });
      } catch (err) {
        console.error('Error checking username:', err);
      } finally {
        setCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, user?.username]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        // Cache-bust preview so the newest photo shows instantly
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({ ...prev, profile_pic: file }));
      setSuccess('Photo selected! Click Save to update.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }
    
    setDeletingPic(true);
    try {
      const res = await API.delete('/users/profile-picture');
      // AuthContext doesn't expose setUser; navigate away and refetch via profile page.
      setPreview(null);
      setFormData(prev => ({ ...prev, profile_pic: null }));
      setSuccess('Profile picture deleted!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting profile picture:', err);
      setError(err.response?.data?.msg || 'Failed to delete profile picture');
    } finally {
      setDeletingPic(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('username', formData.username);
      data.append('bio', formData.bio);
      if (formData.profile_pic instanceof File) {
        data.append('profile_pic', formData.profile_pic);
      }


      const res = await API.put('/users/profile', data);
      // If Context exposes token/other mechanisms later, we can refresh user here.



      // AuthContext in this project doesn't expose setUser.
      // Keep local success + redirect only.
      // If other pages need the updated avatar immediately, they will refetch on navigation.
      // (Navbar/Profile will update after redirect.)
      setSuccess('Profile updated successfully!');

      // Refresh auth user so Navbar updates instantly
      await fetchUser();

      // Also force a local re-render of the preview image to avoid any cache race
      // when browser reuses the previous /uploads/... URL.
      if (res.data?.profile_pic) {
        setPreview(null);
        setTimeout(() => setPreview(getImagePath(res.data.profile_pic)), 0);
      }

      // Redirect to profile after short delay

      setTimeout(() => {
        navigate(`/profile/${res.data.username}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMsg = err.response?.data?.msg || 'Failed to update profile';
      
      // Check if it's a username taken error
      if (err.response?.data?.msg?.toLowerCase().includes('username')) {
        setError('This username is already taken. Please choose another.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/profile/${user?.username}`);
  };

  if (!user) {
    return <div className="edit-profile-container">Please login to edit your profile</div>;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h1>Edit Profile</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="form-group profile-pic-group">
            <label>Profile Picture</label>
            <div className="profile-pic-preview">
              {preview ? (
                <img src={preview} alt="Profile preview" />
              ) : (
                <div className="profile-pic-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
              <div className="profile-pic-buttons">
                <button 
                  type="button" 
                  className="change-pic-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change
                </button>
                {user.profile_pic && (
                  <button 
                    type="button" 
                    className="delete-pic-btn"
                    onClick={handleDeleteProfilePicture}
                    disabled={deletingPic}
                  >
                    {deletingPic ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="username-input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className={usernameStatus.checked ? (usernameStatus.available ? 'username-available' : 'username-taken') : ''}
              />
              {checkingUsername && <span className="username-status checking">Checking...</span>}
              {!checkingUsername && usernameStatus.checked && (
                <span className={`username-status ${usernameStatus.available ? 'available' : 'taken'}`}>
                  {usernameStatus.available ? '✓ Username available' : '✗ Username already taken'}
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
