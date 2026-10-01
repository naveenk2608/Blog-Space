import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LikeButton from './LikeButton';
import { getErrorMessage } from '../utils/errorMessage';
import { getAvatarUrl } from '../utils/imageUrl';
import './styles/Comment.css';

const Comment = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isOwner = user && user.id === comment.user_id;

  const handleUpdate = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setError('A comment cannot be empty.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await API.put(`/comments/${comment.id}`, { content: trimmed });
      onUpdate(comment.id, trimmed);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, 'Could not save your changes.'));
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setContent(comment.content);
    setError('');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete comment?')) return;
    setBusy(true);
    setError('');
    try {
      await API.delete(`/comments/${comment.id}`);
      onDelete(comment.id);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, 'Could not delete this comment.'));
      setBusy(false);
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
           <button onClick={handleUpdate} disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
           <button onClick={handleCancel} disabled={busy}>Cancel</button>
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
          <button onClick={() => setIsEditing(true)} disabled={busy}>Edit</button>
          <button onClick={handleDelete} disabled={busy}>{busy ? 'Deleting...' : 'Delete'}</button>
        </div>
      )}
    </div>

    {error && <p className="comment-error" role="alert">{error}</p>}
  </div>
</div>
  );
};

export default Comment;