import axios from 'axios';
import { API_URL } from '../config/constants.js';

const api = axios.create({
  // Accedemos a la variable de entorno VITE_API_URL (localhost:4000 si no existe)
  baseURL: API_URL , 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;