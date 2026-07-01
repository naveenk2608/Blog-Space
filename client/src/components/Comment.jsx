import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LikeButton from './LikeButton';
import { getAvatarUrl } from '../utils/imageUrl';
import './styles/Comment.css';

const Comment = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const isOwner = user && user.id === comment.user_id;

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
  <img src={getAvatarUrl(comment.profile_pic, comment.name)} alt={comment.name} className="avatar" />
  
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