import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page or handle unauthorized error
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
