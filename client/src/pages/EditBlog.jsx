import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import './styles/CreateBlog.css'; // reuse same styles

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    cover_image: null,
    existingCover: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Define the base URL for your backend server
  const BASE_URL = "http://localhost:5000";

  // Helper function to build the image path correctly
  const getImagePath = (path) => {
    if (!path) return '/default-avatar.png';
    if (path.startsWith('http')) return path;
    
    // If path already contains /uploads/, use it directly
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL}${path}`;
    }
    // Otherwise, add /uploads/ prefix
    return `${BASE_URL}/uploads/${path}`;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        const blog = res.data.blog;
        setForm({
          title: blog.title,
          content: blog.content,
          cover_image: null,
          existingCover: blog.cover_image || '',
          status: blog.status
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, cover_image: file });
    
    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (status) => {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('status', status);
    if (form.cover_image) {
      formData.append('cover_image', form.cover_image);
    }
    try {
      await API.put(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Determine which image to show in the upload area
  const showImage = previewUrl || (form.existingCover && !form.cover_image ? getImagePath(form.existingCover) : null);

  return (
    <div className="create-blog">
      <h2>Edit Blog Post</h2>

      <div className="cover-upload">
        <label>Cover Image</label>
        <div className="upload-area" onClick={() => document.getElementById('cover').click()}>
          {showImage ? (
            <img src={showImage} alt="Cover Preview" className="image-preview" />
          ) : form.cover_image ? (
            form.cover_image.name
          ) : (
            'Click to upload cover image'
          )}
        </div>
        <input
          type="file"
          id="cover"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Content</label>
        <textarea
          name="content"
          rows="10"
          value={form.content}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button onClick={() => navigate(`/blog/${id}`)}>Cancel</button>
        <button onClick={() => handleSubmit('draft')}>Save as Draft</button>
        <button onClick={() => handleSubmit('published')} className="publish">Publish</button>
      </div>
    </div>
  );
};

export default EditBlog;
