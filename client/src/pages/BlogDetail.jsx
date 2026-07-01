import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentList from '../components/CommentList';
import LikeButton from '../components/LikeButton';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { getImageUrl, getAvatarUrl } from '../utils/imageUrl';
import './styles/BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await API.get(`/blogs/${id}`);
      setBlog(res.data.blog);
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    try {
      await API.post(`/comments/blog/${id}`, { content: newComment });
      setNewComment('');
      fetchBlog(); // refresh comments
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentUpdate = (commentId, newContent) => {
    setComments(comments.map(c => c.id === commentId ? { ...c, content: newContent } : c));
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  const isOwner = user && user.id === blog.user_id;

  return (
    <div className="blog-detail-card">
      {/* Featured Image - Top of card - always show with default fallback */}
      <div className="blog-image-container">
        <img src={getImageUrl(blog.cover_image)} alt="cover" className="blog-cover-image" />
      </div>

      {/* Title */}
      <h1 className="blog-title">{blog.title}</h1>

      {/* Header & Metadata - Horizontal row below image */}
      <div className="blog-header-row">
        <div className="author-info">
          <img src={getAvatarUrl(blog.profile_pic, blog.name)} alt={blog.name} className="avatar" />
          <div className="author-details">
            <span className="author-name">{blog.name}</span>
            <span className="username">@{blog.username}</span>
          </div>
        </div>
        
        <div className="post-meta">
          <span className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Blog Content */}
      <div className="blog-content">{blog.content}</div>

      {/* Footer Actions */}
      <div className="blog-footer">
        <div className="footer-actions">
          <LikeButton
            itemId={blog.id}
            type="blog"
            initialLiked={blog.likedByUser}
            initialCount={blog.likeCount}
          />
          <span className="comment-count">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {blog.commentCount} comments
          </span>
        </div>
        {isOwner && (
          <Link to={`/edit/${blog.id}`} className="edit-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </Link>
        )}
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments ({blog.commentCount})</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <p>Please <Link to="/login">login</Link> to comment.</p>
        )}

        <CommentList
          comments={comments}
          onUpdate={handleCommentUpdate}
          onDelete={handleCommentDelete}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
