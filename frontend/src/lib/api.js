import axios from 'axios'

console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('Process env VITE_API_URL:', typeof process !== 'undefined' ? process.env.VITE_API_URL : 'process not available');

const baseURL = import.meta.env.VITE_API_URL || '/api';
console.log('Using baseURL:', baseURL);

export const api = axios.create({
  baseURL: baseURL
})