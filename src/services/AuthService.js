import axios from 'axios';

// Usamos la URL del backend en Render
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (mail, password) => {
    try {
        const response = await axios.post(`${API_URL}/usuarios/login`, {
            mail: mail,
            password : password // Tiene que ser el nombre que espera el backend, no "password" o "contraseña" o algo asi. Tiene que ser EXACTAMENTE "password" porque el backend lo lee con ese nombre.
        });
        return response.data; // Esto debería traer { user, token }
    } catch (error) {
        // Capturamos el error para mostrarlo en la UI si algo se rompe
        throw error.response?.data?.message || 'Error al conectar con el servidor';
    }
};