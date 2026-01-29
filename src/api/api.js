import axios from 'axios';

const api = axios.create({
  // Así se accede a las variables en Vite
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json'
  }
});
// ... resto del código del interceptor