import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/BottomNav.css';

const BottomNav = () => {
  const { user } = useAuth();
  return (
    <div className="bottom-nav">
      <Link to="/">Home</Link>
      <Link to="/create">Write</Link>
      {user && <Link to={`/profile/${user.username}`}>{user.username}</Link>}
    </div>
  );
};

export default BottomNav;