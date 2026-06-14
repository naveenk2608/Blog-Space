import { Link } from 'react-router-dom';
import './styles/ProfileBlogCard.css';

const ProfileBlogCard = ({ blog, onDelete }) => {
  // Define the base URL for your backend server
  const BASE_URL = "http://localhost:5000";

  // Helper function to build the image path correctly
  const getImagePath = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop';
    if (path.startsWith('http')) return path;
    
    // If path already contains /uploads/, use it directly
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL}${path}`;
    }
    // Otherwise, add /uploads/ prefix
    return `${BASE_URL}/uploads/${path}`;
  };

  // Get excerpt (short preview)
  const getExcerpt = (content) => {
    if (!content) return '';
    return content.length > 120 ? content.substring(0, 120) + '...' : content;
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this blog?')) {
      onDelete(blog.id);
    }
  };

  return (
    <div className="profile-blog-card">
      <Link to={`/blog/${blog.id}`} className="profile-card-image-link">
        <img 
          src={getImagePath(blog.cover_image)} 
          alt={blog.title} 
          className="profile-card-cover" 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop'; }}
        />
      </Link>
      
      {/* Status Badge */}
      <span className="profile-card-status">{blog.status === 'draft' ? 'Draft' : 'Published'}</span>

      <div className="profile-card-content">
        <Link to={`/blog/${blog.id}`} className="profile-card-text-link">
          <h3 className="profile-card-title">{blog.title}</h3>
          <p className="profile-card-excerpt">{getExcerpt(blog.content)}</p>
        </Link>

        {/* Engagement Row - Only Likes and Comments */}
        <div className="profile-card-engagement">
          <span className="profile-card-stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {blog.likeCount || 0}
          </span>
          <span className="profile-card-stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {blog.commentCount || 0}
          </span>
        </div>

        {/* Action Buttons Footer */}
        <div className="profile-card-actions">
          <Link to={`/edit/${blog.id}`} className="edit-btn">
            Edit
          </Link>
          <button onClick={handleDelete} className="delete-btn" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBlogCard;
