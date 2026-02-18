import axios from 'axios';

const api = axios.create({
  // Así se accede a las variables en Vite
  //baseURL: import.meta.env.VITE_API_URL, 
  baseURL: 'http://localhost:4000', // Cambia esto a tu URL de desarrollo o producción
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;