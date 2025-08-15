// frontend/src/axiosConfig.jsx
import axios from 'axios';

const api = axios.create({
  // OPTION A (preferred): use CRA proxy via package.json
  baseURL: '/api', // <-- important: just "/api"
  // If we still fail after step 4, switch to OPTION B below.
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
