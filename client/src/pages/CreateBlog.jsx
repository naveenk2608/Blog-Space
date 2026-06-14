import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './styles/CreateBlog.css';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    cover_image: null,
    status: 'draft'
  });
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleRemoveImage = () => {
    setForm({ ...form, cover_image: null });
    setPreviewUrl(null);
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (status) => {
    setErrorMsg('');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('status', status);
    if (form.cover_image) {
      formData.append('cover_image', form.cover_image);
    }

    try {
      await API.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err?.response?.data?.errors?.map((e) => e.msg).join(', ') ||
        err?.message ||
        'Upload failed';
      setErrorMsg(msg);
    }
  };

  // Determine what to show in upload area
  const showPreview = previewUrl || form.cover_image;

  return (
    <div className="create-blog-page">
      <div className="create-blog">
        <h2>Create New Blog Post</h2>


        <div className="cover-upload">
          <label>Cover Image</label>
          {showPreview ? (
            <div className="image-preview-container">
              <img 
                src={previewUrl || URL.createObjectURL(form.cover_image)} 
                alt="Cover Preview" 
                className="image-preview" 
              />
              <button type="button" className="close-btn" onClick={handleRemoveImage}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ) : (
            <div className="upload-area" onClick={() => document.getElementById('cover').click()}>
              <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="upload-text">Click to upload cover image</span>
            </div>
          )}
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
            placeholder="Enter your blog title..."
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            placeholder="Write your blog content..."
            rows="10"
            value={form.content}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <div className="form-actions-message">
            {errorMsg ? (
              <p className="form-error form-error-actions">
                {errorMsg === 'This file type is not supported'
                  ? 'This file type is not supported'
                  : errorMsg}
              </p>
            ) : null}
          </div>

          <div className="form-actions-buttons">
            <button onClick={() => navigate('/')}>Cancel</button>
            <button onClick={() => handleSubmit('draft')}>Save as Draft</button>
            <button onClick={() => handleSubmit('published')} className="publish">Publish</button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CreateBlog;
