import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://be-inventory-management.onrender.com/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // Increased timeout for Render.com cold starts
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable sending cookies and credentials
  withCredentials: true
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    console.log('Request URL:', config.url);

    // Add CORS headers to every request
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept, Authorization';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    } else {
      console.log('No token found in localStorage');
    }

    // Handle OPTIONS preflight
    if (config.method === 'options') {
      config.headers['Access-Control-Max-Age'] = '86400'; // 24 hours
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.error('Response error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      method: originalRequest?.method,
      data: error.response?.data
    });

    // Handle CORS errors
    if (error.response?.status === 0 && error.message === 'Network Error') {
      console.error('CORS error detected');
      // You might want to show a user-friendly message here
      return Promise.reject(new Error('Unable to connect to the server. Please try again later.'));
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('401 error detected, redirecting to login');
      // Clear token and redirect to login page
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;