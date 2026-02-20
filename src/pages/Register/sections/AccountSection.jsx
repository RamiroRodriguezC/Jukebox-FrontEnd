import { useState, useContext } from 'react';
import { message } from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../api/api';
import '../../../styles/forms.css';

const AccountSection = () => {
  const { user }              = useContext(AuthContext);
   console.log('user en ProfileSection:', user); // ← agregá esto temporalmente
  const [pwForm, setPwForm]   = useState({ newPassword: '', confirmPassword: '' });
  const [saving, setSaving]   = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setPwForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFeedback(null);
  };

  const handleSave = async () => {
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
      message.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onClick={handleSave}
              disabled={saving || !pwForm.newPassword || !pwForm.confirmPassword}
            >
              {saving ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;