import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import './styles/BlogCard.css';

const BlogCard = ({ blog }) => {
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

  const getAvatarPath = (path) => {
    if (!path) return 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(blog?.name || 'User');
    if (path.startsWith('http')) return path;
    
    // If path already contains /uploads/, use it directly
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL}${path}`;
    }
    // Otherwise, add /uploads/ prefix
    return `${BASE_URL}/uploads/${path}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get excerpt (2-3 lines = ~150 chars)
  const getExcerpt = (content) => {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  return (
    <div className="blog-card">
      <Link to={`/blog/${blog.id}`} className="card-image-link">
        <img 
          src={getImagePath(blog.cover_image)} 
          alt={blog.title} 
          className="card-cover" 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop'; }}
        />
      </Link>

      <div className="card-content">
        <Link to={`/blog/${blog.id}`} className="card-text-link">
          <h3 className="card-title">{blog.title}</h3>
          <p className="card-excerpt">{getExcerpt(blog.content)}</p>
        </Link>

        <div className="card-author-row">
          <img 
            src={getAvatarPath(blog.profile_pic)} 
            alt={blog.name} 
            className="card-avatar" 
            onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(blog?.name || 'User'); }}
          />
          <div className="card-author-info">
            <span className="card-author-name">{blog.name}</span>
            <span className="card-author-username">@{blog.username}</span>
          </div>
        </div>

        <div className="card-footer">
          <LikeButton 
            itemId={blog.id} 
            type="blog" 
            initialLiked={blog.likedByUser} 
            initialCount={blog.likeCount || 0} 
          />
          <span className="card-stat comments">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {blog.commentCount || 0}
          </span>
          <span className="card-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(blog.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
