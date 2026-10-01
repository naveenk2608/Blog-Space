import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import StatusMessage, { LoadingMessage } from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { getErrorMessage } from '../utils/errorMessage';
import './styles/Home.css';

// Matches the page size the server uses for /blogs
const PAGE_SIZE = 10;

const Home = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [moreError, setMoreError] = useState('');

  const fetchBlogs = async (pageToLoad) => {
    const res = await API.get('/blogs', { params: { page: pageToLoad } });
    setBlogs(prev => {
      // Skip posts already shown (newly published posts shift the pages)
      const shownIds = new Set(prev.map(blog => blog.id));
      return [...prev, ...res.data.filter(blog => !shownIds.has(blog.id))];
    });
    setPage(pageToLoad);
    setHasMore(res.data.length === PAGE_SIZE);
  };

  const loadFirstPage = () => {
    setLoading(true);
    setError('');
    setMoreError('');
    setBlogs([]);
    fetchBlogs(1)
      .catch(err => {
        console.error(err);
        setError(getErrorMessage(err, 'Could not load posts.'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFirstPage();
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setMoreError('');
    try {
      await fetchBlogs(page + 1);
    } catch (err) {
      console.error(err);
      setMoreError(getErrorMessage(err, 'Could not load more posts.'));
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <LoadingMessage message="Loading posts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <StatusMessage
          variant="error"
          title="Could not load posts"
          message={error}
          action={<button type="button" onClick={loadFirstPage}>Try again</button>}
        />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="home">
        <StatusMessage
          title="No posts yet"
          message={user
            ? 'Nothing has been published yet. Be the first to share something.'
            : 'Nothing has been published yet. Sign in to write the first post.'}
          action={user
            ? <Link to="/create">Write a post</Link>
            : <Link to="/login">Log in</Link>}
        />
      </div>
    );
  }

  return (
    <div className="home">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
      {moreError && <p className="load-more-error">{moreError}</p>}
      {hasMore && (
        <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
};

export default Home;
