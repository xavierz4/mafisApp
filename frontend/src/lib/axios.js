import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;
    
    if (response) {
      // Only log errors with status code
      console.error(`[API Error] ${response.status} ${config?.url}`, response.data);
      
      // Handle specific error codes
      switch (response.status) {
        case 401:
          console.error('[Auth Error] Unauthorized - Token invalid or expired');
          // Clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login only if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          console.error('[Auth Error] Forbidden - Insufficient permissions');
          break;
          
        case 404:
          console.error('[Not Found] Resource not found');
          break;
          
        case 500:
          console.error('[Server Error] Internal server error');
          break;
          
        default:
          console.error('[Unknown Error]', response.status);
      }
    } else if (error.request) {
      console.error('[Network Error] No response received', error.request);
    } else {
      console.error('[Request Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
