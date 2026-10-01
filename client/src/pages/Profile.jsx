import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileBlogCard from '../components/ProfileBlogCard';
import StatusMessage, { LoadingMessage } from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { getErrorMessage } from '../utils/errorMessage';
import { getAvatarUrl } from '../utils/imageUrl';
import { IMAGE_ACCEPT } from '../utils/validation';
import './styles/Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, fetchUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadProfile = useCallback(() => {
    // Ignore a slow response for a profile we've already navigated away from
    let ignore = false;

    const fetchProfile = async () => {
      // Clear the previous profile so a failed load shows the error, not old data
      setLoading(true);
      setError(null);
      setProfile(null);
      try {
        const res = await API.get(`/users/${username}`);
        if (ignore) return;
        setProfile(res.data.user);
        setStats(res.data.stats);
        setBlogs(res.data.blogs);
      } catch (err) {
        if (ignore) return;
        console.error(err);
        // A missing user is a dead end; anything else is worth retrying
        setError({
          notFound: err?.response?.status === 404,
          message: getErrorMessage(err, 'Could not load this profile.')
        });
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchProfile();

    return () => { ignore = true; };
  }, [username]);

  useEffect(() => loadProfile(), [loadProfile]);

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
      alert(getErrorMessage(err, 'Failed to upload profile picture'));
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

  if (loading) return <LoadingMessage message="Loading profile..." />;

  if (error || !profile) {
    return error && !error.notFound ? (
      <StatusMessage
        variant="error"
        title="Could not load this profile"
        message={error.message}
        action={<button type="button" onClick={loadProfile}>Try again</button>}
      />
    ) : (
      <StatusMessage
        title="User not found"
        message={`There is no profile for @${username}.`}
        action={<Link to="/">Back to home</Link>}
      />
    );
  }

  const isOwnProfile = !!currentUser && currentUser.id === profile.id;

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
              src={getAvatarUrl(profile.profile_pic, profile.name)}
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
              accept={IMAGE_ACCEPT}
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
            <span className="profile-stat-number">{stats?.blogsCount ?? 0}</span>
            <span className="profile-stat-label">Blogs</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-number">{stats?.totalLikesReceived ?? 0}</span>
            <span className="profile-stat-label">Likes</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-number">{stats?.totalCommentsReceived ?? 0}</span>
            <span className="profile-stat-label">Comments</span>
          </div>
        </div>
      </div>

      {/* My Blogs Section */}
      <div className="my-blogs-section">
        <h2 className="section-header">{isOwnProfile ? 'My Blogs' : 'Blogs'}</h2>
        
        {blogs.length === 0 ? (
          <StatusMessage
            title={isOwnProfile ? 'No posts yet' : 'Nothing published yet'}
            message={isOwnProfile
              ? 'Your published posts will show up here.'
              : `${profile.name} has not published anything yet.`}
            action={isOwnProfile ? <Link to="/create">Write your first post</Link> : null}
          />
        ) : (
          <div className="blog-grid">
            {blogs.map(blog => (
              <ProfileBlogCard 
                key={blog.id} 
                blog={blog} 
                isOwner={isOwnProfile}
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
