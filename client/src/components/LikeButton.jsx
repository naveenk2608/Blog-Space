import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './styles/LikeButton.css';

const LikeButton = ({ itemId, type, initialLiked, initialCount }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like');
      return;
    }
    try {
      const res = await API.post(`/likes/${type}/${itemId}`);
      setLiked(res.data.liked);
      setCount(res.data.likeCount);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLike}>
      {liked ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="like-icon liked">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="like-icon">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      )}
      <span className="like-count">{count}</span>
    </button>
  );
};

export default LikeButton;