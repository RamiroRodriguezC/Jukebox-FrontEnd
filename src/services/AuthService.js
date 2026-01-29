import axios from 'axios';

// Usamos la URL de tu backend en Render
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (mail, password) => {
    try {
        const response = await axios.post(`${API_URL}/usuarios/login`, {
            mail: mail,
            password : password // Asegúrate que tu backend espere este nombre
        });
        return response.data; // Esto debería traer { user, token }
    } catch (error) {
        // Capturamos el error para mostrarlo en la UI
        throw error.response?.data?.message || 'Error al conectar con el servidor';
    }
};