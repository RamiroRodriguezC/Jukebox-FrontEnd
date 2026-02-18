import axios from 'axios';

const api = axios.create({
  // Accedemos a la variable de entorno VITE_API_URL, y si no existe, usamos localhost como fallback
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;