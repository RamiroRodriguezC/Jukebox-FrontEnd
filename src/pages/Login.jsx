import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Ui.css';
import './Login.css';

const Login = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ mail: '', password: '' });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(form.mail, form.password);
      login(data.usuario, data.token);
      navigate('/');
    } catch (err) {
      setError(err || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-brand">
          <h1>Bienvenido</h1>
          <p>Iniciá sesión para continuar en Jukebox</p>
        </div>

        <hr className="login-divider" />

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mail">Email</label>
            <input
              id="mail"
              name="mail"
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              value={form.mail}
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
              placeholder="Tu contraseña"
              value={form.password}
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
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <hr className="login-divider" />

        <p className="login-footer">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;