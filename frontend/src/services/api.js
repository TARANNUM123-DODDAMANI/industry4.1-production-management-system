import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'https://localhost:7085/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated requests and UI Toasts
api.interceptors.response.use(
  (response) => {
    const successMsg = response.data?.Message || response.data?.message;
    if (successMsg) {
      if (['post', 'patch', 'delete'].includes(response.config.method?.toLowerCase()) || response.config.url.includes("summary") || response.config.url.includes('Status') || response.config.url.includes('Get')) {
        const event = new CustomEvent('apiMessage', { detail: { type: 'success', text: successMsg } });
        window.dispatchEvent(event);
      }
    }
    return response;
  },
  (error) => {
    // Attempt to extract explicit API message if it fails
    const errorMsg = error.response?.data?.Message || error.response?.data?.message || null;
    if (errorMsg) {
      const event = new CustomEvent('apiMessage', { detail: { type: 'error', text: errorMsg } });
      window.dispatchEvent(event);
    }
    
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
