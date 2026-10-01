import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import API from '../services/api';
import './styles/Home.css';

// Matches the page size the server uses for /blogs
const PAGE_SIZE = 10;

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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

  useEffect(() => {
    fetchBlogs(1)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await fetchBlogs(page + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
      {hasMore && (
        <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
};

export default Home;
