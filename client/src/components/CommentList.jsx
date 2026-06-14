import Comment from './Comment';
import './styles/CommentList.css';

const CommentList = ({ comments, onUpdate, onDelete }) => {
  if (comments.length === 0) {
    return <p className="no-comments">No comments yet. Be the first to comment!</p>;
  }
  return (
    <div className="comment-list">
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default CommentList;