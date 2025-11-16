import axios from 'axios';
export default api;

);
  }
    return Promise.reject(error);
    }
      window.location.href = '/login';
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_token');
      // Token expired or invalid
    if (error.response?.status === 401) {
  error => {
  response => response,
api.interceptors.response.use(
// Response interceptor to handle errors

);
  }
    return Promise.reject(error);
  error => {
  },
    return config;
    }
      config.headers.Authorization = `Bearer ${token}`;
    if (token) {
    const token = localStorage.getItem('access_token');
  config => {
api.interceptors.request.use(
// Request interceptor to add auth token

});
  },
    'Content-Type': 'application/json',
  headers: {
  baseURL: API_BASE_URL,
const api = axios.create({

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';


