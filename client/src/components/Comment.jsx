import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LikeButton from './LikeButton';
import './styles/Comment.css';

const Comment = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const isOwner = user && user.id === comment.user_id;

  // Define the base URL for your backend server
  const BASE_URL = "http://localhost:5000";

  // Helper function to build the image path correctly
  const getImagePath = (path, fallbackName = 'User') => {
    if (!path) return 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(fallbackName);
    if (path.startsWith('http')) return path;
    
    // If path already contains /uploads/, use it directly
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL}${path}`;
    }
    // Otherwise, add /uploads/ prefix
    return `${BASE_URL}/uploads/${path}`;
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/comments/${comment.id}`, { content });
      onUpdate(comment.id, content);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete comment?')) {
      try {
        await API.delete(`/comments/${comment.id}`);
        onDelete(comment.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    // Inside your Comment.jsx return:
<div className="comment">
  <img src={getImagePath(comment.profile_pic, comment.name)} alt={comment.name} className="avatar" />
  
  <div className="comment-body">
    <div className="comment-header">
      <strong>{comment.name}</strong> 
      <span className="username">@{comment.username}</span>
      <span className="date">{new Date(comment.created_at).toLocaleDateString()}</span>
    </div>

    {isEditing ? (
      <div className="edit-comment">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="comment-actions">
           <button onClick={handleUpdate}>Save</button>
           <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    ) : (
      <p className="comment-content">{comment.content}</p>
    )}

    <div className="comment-footer">
      <LikeButton
        itemId={comment.id}
        type="comment"
        initialLiked={comment.likedByUser}
        initialCount={comment.likeCount}
      />
      {isOwner && !isEditing && (
        <div className="comment-actions">
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default Comment;