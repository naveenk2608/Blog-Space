import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusMessage, { LoadingMessage } from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { getErrorMessage } from '../utils/errorMessage';
import { getImageUrl } from '../utils/imageUrl';
import { IMAGE_ACCEPT } from '../utils/validation';
import './styles/CreateBlog.css'; // reuse same styles

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    content: '',
    cover_image: null,
    existingCover: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        const blog = res.data.blog;
        // Only the author can edit (the server rejects anyone else's save anyway)
        if (blog.user_id !== user.id) {
          setLoadError('You can only edit your own posts.');
          return;
        }
        setForm({
          title: blog.title,
          content: blog.content,
          cover_image: null,
          existingCover: blog.cover_image || '',
          status: blog.status
        });
      } catch (err) {
        console.error(err);
        setLoadError(getErrorMessage(err, 'Could not load this blog.'));
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, user.id]);

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
    setErrorMsg('');
    setSubmitting(true);

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
      setErrorMsg(getErrorMessage(err, 'Could not save your changes.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingMessage message="Loading post..." />;

  if (loadError) {
    return (
      <StatusMessage
        variant="error"
        title="Could not open this post"
        message={loadError}
        action={<Link to="/">Back to home</Link>}
      />
    );
  }

  // Determine which image to show in the upload area
  const showImage = previewUrl || (form.existingCover && !form.cover_image ? getImageUrl(form.existingCover, '/default-avatar.png') : null);

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
          accept={IMAGE_ACCEPT}
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

      {errorMsg && <p className="form-error">{errorMsg}</p>}

      <div className="form-actions">
        <button onClick={() => navigate(`/blog/${id}`)}>Cancel</button>
        <button onClick={() => handleSubmit('draft')} disabled={submitting}>Save as Draft</button>
        <button onClick={() => handleSubmit('published')} className="publish" disabled={submitting}>Publish</button>
      </div>
    </div>
  );
};

export default EditBlog;
