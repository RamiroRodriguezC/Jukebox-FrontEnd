import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import genericUser from '../../assets/genericArtist.png';
import './UserSettings.css';
import '../../styles/forms.css';

const SECTIONS = [
  { key: 'profile', label: 'Perfil',         icon: '👤' },
  { key: 'account', label: 'Cuenta',          icon: '🔑' },
  { key: 'danger',  label: 'Zona peligrosa',  icon: '⚠️' },
];

const UserSettings = () => {
  const navigate                    = useNavigate();
  const { user, login, logout }     = useContext(AuthContext);
  const [activeSection, setSection] = useState('profile');

  const [form, setForm] = useState({
    username:          user?.nombre || user?.username || '',
    mail:              user?.mail   || '',
    bio:               user?.bio    || '',
    url_profile_photo: user?.url_profile_photo || '',
  });

  const [pwForm, setPwForm] = useState({
    newPassword:     '',
    confirmPassword: '',
  });

  const [saving,   setSaving]   = useState(false);
  const [feedback, setFeedback] = useState(null);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFeedback(null);
  };

  const handlePwChange = (e) => {
    setPwForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFeedback(null);
  };

  const handleCancel = () => {
    setForm({
      username:          user?.nombre || user?.username || '',
      mail:              user?.mail   || '',
      bio:               user?.bio    || '',
      url_profile_photo: user?.url_profile_photo || '',
    });
    setFeedback(null);
  };

  // ── Guardar perfil ────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!form.username.trim()) {
      setFeedback({ type: 'error', msg: 'El username no puede estar vacío.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const token  = localStorage.getItem('token');
      const userId = user?._id || user?.id;

      const { data } = await api.put(
        `/usuarios/${userId}`,
        {
          username:          form.username,
          mail:              form.mail,
          bio:               form.bio,
          url_profile_photo: form.url_profile_photo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = {
        ...user,
        nombre:            data.username          ?? form.username,
        username:          data.username          ?? form.username,
        mail:              data.mail              ?? form.mail,
        bio:               data.bio               ?? user.bio,
        url_profile_photo: data.url_profile_photo ?? form.url_profile_photo,
      };
      login(updatedUser, token);

      setFeedback({ type: 'ok', msg: '¡Cambios guardados correctamente!' });
      message.success('Perfil actualizado');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al guardar los cambios.';
      setFeedback({ type: 'error', msg });
      message.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Guardar contraseña ────────────────────────────────────────────────────
  const handleSavePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setFeedback({ type: 'error', msg: 'Las contraseñas no coinciden.' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setFeedback({ type: 'error', msg: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const token  = localStorage.getItem('token');
      const userId = user?._id || user?.id;

      await api.put(
        `/usuarios/${userId}`,
        { password: pwForm.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPwForm({ newPassword: '', confirmPassword: '' });
      setFeedback({ type: 'ok', msg: '¡Contraseña actualizada!' });
      message.success('Contraseña actualizada');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al cambiar la contraseña.';
      setFeedback({ type: 'error', msg });
    } finally {
      setSaving(false);
    }
  };

  // ── Secciones ─────────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="settings-section">
      <h2 className="section-title">Perfil público</h2>
      <p className="section-subtitle">Esta información será visible en tu página de perfil.</p>

      <div className="avatar-section">
        <div className="avatar-wrapper">
          <img
            src={form.url_profile_photo || genericUser}
            alt="Avatar"
            className="avatar-img"
          />
        </div>
        <div className="avatar-info">
          <p>Pegá el URL de tu foto de perfil abajo. JPG, PNG o GIF.</p>
          <button
            className="btn-change-avatar"
            onClick={() => document.getElementById('url_profile_photo').focus()}
          >
            Cambiar foto
          </button>
        </div>
      </div>

      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="url_profile_photo">URL de foto de perfil</label>
          <input
            id="url_profile_photo"
            name="url_profile_photo"
            className="form-input"
            placeholder="https://..."
            value={form.url_profile_photo}
            onChange={handleChange}
          />
          <p className="field-hint">Usá un link directo a una imagen pública.</p>
        </div>

        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              className="form-input"
              placeholder="TuUsername"
              value={form.username}
              onChange={handleChange}
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
              value={form.mail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Biografía</label>
          <textarea
            id="bio"
            name="bio"
            className="form-textarea"
            placeholder="Contá algo sobre vos..."
            value={form.bio}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Rol</label>
          <input
            className="form-input"
            value={user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
            disabled
          />
          <p className="field-hint">El rol no se puede modificar desde aquí.</p>
        </div>

        <div className="form-actions">
          {feedback && (
            <span className={`save-feedback ${feedback.type === 'error' ? 'error' : ''}`}>
              {feedback.type === 'ok' ? '✓' : '✕'} {feedback.msg}
            </span>
          )}
          <button className="btn-cancel" onClick={handleCancel} disabled={saving}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="settings-section">
      <h2 className="section-title">Cuenta</h2>
      <p className="section-subtitle">Gestioná tu seguridad y acceso.</p>

      <div className="password-section">
        <h3 className="section-title">Cambiar contraseña</h3>
        <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
          Elegí una contraseña segura que no uses en otros sitios.
        </p>

        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={pwForm.newPassword}
              onChange={handlePwChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Repetí la contraseña"
              value={pwForm.confirmPassword}
              onChange={handlePwChange}
            />
          </div>

          <div className="form-actions">
            {feedback && (
              <span className={`save-feedback ${feedback.type === 'error' ? 'error' : ''}`}>
                {feedback.type === 'ok' ? '✓' : '✕'} {feedback.msg}
              </span>
            )}
            <button
              className="btn-save"
              onClick={handleSavePassword}
              disabled={saving || !pwForm.newPassword || !pwForm.confirmPassword}
            >
              {saving ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDanger = () => (
    <div className="settings-section">
      <h2 className="section-title">Zona peligrosa</h2>
      <p className="section-subtitle">Las siguientes acciones son irreversibles. Procedé con cuidado.</p>

      <div className="danger-zone">
        <h3>Desactivar cuenta</h3>
        <p>Tu cuenta será marcada como inactiva. No podrás iniciar sesión hasta que un administrador la reactive.</p>
        <button className="btn-danger" onClick={() => message.warning('Función no implementada aún.')}>
          Desactivar mi cuenta
        </button>
      </div>
    </div>
  );

  if (!user) {
    navigate('/Login');
    return null;
  }

  return (
    <div className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <h1>Configuración</h1>
          <p>Gestioná tu perfil y preferencias de cuenta</p>
        </div>

        <div className="settings-layout">
          <nav className="settings-sidebar">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                className={`sidebar-btn ${activeSection === s.key ? 'active' : ''}`}
                onClick={() => { setSection(s.key); setFeedback(null); }}
              >
                <span className="sidebar-icon">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>

          <main>
            {activeSection === 'profile' && renderProfile()}
            {activeSection === 'account' && renderAccount()}
            {activeSection === 'danger'  && renderDanger()}
          </main>
        </div>

      </div>
    </div>
  );
};

export default UserSettings;