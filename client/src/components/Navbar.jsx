import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Helper function to get profile pic URL
  const getProfilePic = (path) => {
    const BASE_URL = "http://localhost:5000";
    
    // If no path, return default avatar using DiceBear
    if (!path) return 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user?.name || 'User');
    
    // If it's already a full URL, return as is
    if (path.startsWith('http')) return path;
    
    // If path already starts with /uploads/, use it directly
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL}${path}?t=${Date.now()}`;
    }
    
    // Otherwise add /uploads/ prefix
    return `${BASE_URL}/uploads/${path}?t=${Date.now()}`;
  };

  // Get profile pic from user object - check multiple possible field names
  const userProfilePic = user?.profile_pic || user?.profilePic || user?.avatar || null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          BlogSpace
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/create" className="write-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
                Write
              </Link>
              <Link to={`/profile/${user.username}`} className="profile-link">
                <img 
                  src={getProfilePic(userProfilePic)} 
                  alt={user.username} 
                  className="nav-avatar"
                  onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user?.name || 'User'); }}
                />
                <span className="nav-username">{user.username}</span>
              </Link>
              <button onClick={logout} className="logout-btn" title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="logout-text">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
