import axios from 'axios'

// Ensure we're using the correct API URL
const baseURL = import.meta.env.VITE_API_URL || '/api';

// Log the configuration for debugging
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('Using baseURL:', baseURL);

// Create axios instance with proper configuration
export const api = axios.create({
  baseURL: baseURL,
  timeout: 30000, // 30 second timeout
  withCredentials: true // Enable credentials for CORS
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);