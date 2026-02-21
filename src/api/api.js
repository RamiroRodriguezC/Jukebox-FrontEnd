import axios from 'axios';

const api = axios.create({
  // Accedemos a la variable de entorno VITE_API_URL, y si no existe, usamos localhost como fallback
  baseURL: 'http://localhost:4000' || import.meta.env.VITE_API_URL || 'http://localhost:4000', 
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