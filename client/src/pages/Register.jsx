import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/Login.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    profile_pic: null
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, profile_pic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    if (form.profile_pic) {
      formData.append('profile_pic', form.profile_pic);
    }
    try {
      await register(formData);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Create your account</h2>
        <p className="auth-subtitle">Join BlogSpace and start writing</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Jane Doe" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="janedoe" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>
          <div className="file-input">
            <label>Profile Picture (optional)</label>
            <input type="file" name="profile_pic" accept="image/*" onChange={handleFileChange} />
          </div>
          <button type="submit">Register</button>
        </form>
        <p className="auth-footer-text">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;