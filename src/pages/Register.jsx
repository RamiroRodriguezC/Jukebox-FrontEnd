import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    mail: '', // Cambiado de 'email' a 'mail' para coincidir con el modelo
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      const response = await api.post(`/usuarios/create`, {
        username: formData.username,
        mail: formData.mail, // Campo exacto del modelo
        password: formData.password, // El backend deberá convertir esto a passwordHash
        rol: 'user' // Valor por defecto según el enum de tu modelo
      });

      console.log("Usuario creado:", response.data);
      navigate('/login');
      
    } catch (err) {
      // Axios guarda la respuesta del servidor en err.response
      const mensajeDelServer = err.response?.data?.message || "Error al conectar con el servidor";
      setError(mensajeDelServer);
      console.error("Error detallado:", err.response?.data);
    }
  };

  return (
    <div className="search-page-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 style={{color: 'white', textAlign: 'center'}}>Crear Cuenta</h2>
        {error && <p className="error-message" style={{color: '#ef4444'}}>{error}</p>}
        
        <input
          name="username"
          placeholder="Nombre de usuario"
          className="search-input"
          onChange={handleChange}
          required
        />
        
        <input
          name="mail" // Nombre interno 'mail'
          type="email"
          placeholder="Correo electrónico"
          className="search-input"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="search-input"
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Repetir contraseña"
          className="search-input"
          onChange={handleChange}
          required
        />

        <button type="submit" className="search-nav-item active" style={{width: '100%', marginTop: '10px'}}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;