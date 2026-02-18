// traemos la url de la api desde las variables de entorno, si no existe, usamos localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';