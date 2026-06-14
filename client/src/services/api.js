import axios from 'axios';

const API = axios.create({
  // Append '/api' to the URL here
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

// Interceptors remain the same...
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default API;