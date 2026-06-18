const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getImageUrl = (path, fallback = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop') => {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

export const getAvatarUrl = (path, name = 'User') => {
  const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
  return getImageUrl(path, fallback);
};
