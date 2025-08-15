import axios from 'axios';

const api = axios.create({ baseURL: '/' }); // proxy will forward /api/* to 5001

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
