import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api.js';
import './Register.css';
import '../../styles/forms.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    mail: '', // Cambiado de 'email' a 'mail' para coincidir con el modelo
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.username.trim()) {
      return setError('El nombre de usuario es obligatorio.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
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
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-brand">
          <h1>Crear cuenta</h1>
          <p>Sumate a Jukebox y empezá a reseñar</p>
        </div>

        <hr className="register-divider" />

        <form className="settings-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              name="username"
              className="form-input"
              placeholder="TuUsername"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mail">Email</label>
            <input
              id="mail"
              name="mail"
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              value={formData.mail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Repetí la contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <span className="save-feedback error">✕ {error}</span>
          )}

          <button
            type="submit"
            className="btn-save"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

        </form>

        <hr className="register-divider" />

        <p className="register-footer">
          ¿Ya tenés cuenta? <Link to="/Login">Iniciá sesión</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;