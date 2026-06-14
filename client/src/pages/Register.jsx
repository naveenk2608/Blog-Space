import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/Register.css';

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
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <div className="file-input">
          <label>Profile Picture (optional)</label>
          <input type="file" name="profile_pic" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;