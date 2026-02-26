import { useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../api/api';
import genericUser from '../../../assets/genericArtist.png';
import '../../../styles/Ui.css';

const getInitialForm = (user) => ({
  username:          user?.nombre || user?.username || '',
  mail:              user?.mail   || '',
  bio:               user?.bio    || '',
  url_profile_photo: user?.url_profile_photo || '',
});

/**
 * Esta funcion renderiza la seccion de perfil del usuario, donde puede editar su informacion personal como username, email, biografia y foto de perfil. Utiliza el contexto de autenticacion para obtener los datos del usuario y una funcion de login para actualizar el contexto despues de guardar los cambios. Hace peticiones a la API para actualizar la informacion del usuario en el backend.
 * @returns 
 */
const ProfileSection = () => {
  const { user, login }     = useContext(AuthContext);
  const [form, setForm]     = useState(() => getInitialForm(user));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Sincroniza el form si el usuario cambia (re-login, guardar cambios)
  useEffect(() => {
    setForm(getInitialForm(user));
  }, [user]);

  // Manejadores de cambio en los inputs del formulario
  // Cada vez que el usuario escribe algo en un input, actualizamos el estado del formulario y 
  // limpiamos cualquier mensaje de feedback previo.
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFeedback(null);
  };

  const handleCancel = () => {
    setForm(getInitialForm(user));
    setFeedback(null);
  };

  const handleSave = async () => {
    if (!form.username.trim()) {
      setFeedback({ type: 'error', msg: 'El username no puede estar vacío.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const token    = localStorage.getItem('token');
      const userId   = user?._id || user?.id;
      const { data } = await api.put(
        `/usuarios/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      login({ ...user, ...form, ...data }, token);
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

  return (
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
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;