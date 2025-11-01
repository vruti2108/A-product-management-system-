import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Axios instance with baseURL = /api
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH — NO /api PREFIX
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials)
};

// PRODUCTS — NO /api PREFIX
export const productAPI = {
  getProducts: () => api.get('/products'),
  addProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

export default api;
