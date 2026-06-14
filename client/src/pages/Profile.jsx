import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileBlogCard from '../components/ProfileBlogCard';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './styles/Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, fetchUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Define the base URL for your backend server
  const BASE_URL = "http://localhost:5000";

  // Helper function to build the image path correctly
  const getImagePath = (path) => {
    if (!path) return 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(profile?.name || 'User');
    if (path.startsWith('http')) return path;
    
    // If path already contains /uploads/, use it directly
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL}${path}?t=${Date.now()}`;
    }
    // Otherwise, add /uploads/ prefix
    return `${BASE_URL}/uploads/${path}?t=${Date.now()}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${username}`);
        setProfile(res.data.user);
        setStats(res.data.stats);
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('profile_pic', file);

    try {
      const res = await API.put('/users/profile', formData);
      setProfile(res.data);

      // Refresh auth user so Navbar header updates instantly
      if (typeof fetchUser === 'function') {
        await fetchUser();
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await API.delete(`/blogs/${blogId}`);
      // Remove the deleted blog from the list
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found</div>;

  const isOwnProfile = currentUser && currentUser.username === username;

  return (
    <div className="profile">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        {/* Edit Profile Link */}
        {isOwnProfile && (
          <Link to="/edit-profile" className="edit-profile-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </Link>
        )}

        <div className="profile-header-content">
          {/* Avatar with Upload Overlay */}
          <div className="profile-avatar-container">
            <img 
              src={getImagePath(profile.profile_pic)} 
              alt={profile.name} 
              className="profile-avatar" 
            />
            {isOwnProfile && (
              <div className="profile-avatar-overlay" onClick={triggerFileInput}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="profile-file-input"
            />
          </div>


          {/* User Info */}

          <div className="profile-user-info">

            <h1 className="profile-name">{profile.name}</h1>

            <p className="profile-username">@{profile.username}</p>

            {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          </div>

        </div>

        {/* Stats Row - Only Blogs, Likes, Comments (no Views) */}
        <div className="profile-stats-row">
          <div className="profile-stat-item">
            <span className="profile-stat-number">{stats.blogsCount}</span>
            <span className="profile-stat-label">Blogs</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-number">{stats.totalLikesReceived}</span>
            <span className="profile-stat-label">Likes</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-number">{stats.totalCommentsReceived}</span>
            <span className="profile-stat-label">Comments</span>
          </div>
        </div>
      </div>

      {/* My Blogs Section */}
      <div className="my-blogs-section">
        <h2 className="section-header">My Blogs</h2>
        
        {blogs.length === 0 ? (
          <p className="no-blogs">No blogs yet.</p>
        ) : (
          <div className="blog-grid">
            {blogs.map(blog => (
              <ProfileBlogCard 
                key={blog.id} 
                blog={blog} 
                onDelete={handleDeleteBlog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
