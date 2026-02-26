import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ProfileSection from './sections/ProfileSection';
import AccountSection from './sections/AccountSection';
import FavoritesSection from './sections/FavoritesSection';
import DangerSection  from './sections/DangerSection';
import './UserSettings.css';

const SECTIONS = [
  { key: 'profile', label: 'Perfil',        icon: '👤' },
  { key: 'account', label: 'Cuenta',         icon: '🔑' },
  { key: 'Favs',  label: 'Favoritos', icon: '⚠️' },
  { key: 'danger',  label: 'Zona peligrosa', icon: '⚠️' },
];

/**
 * Pagina de configuracion para el usuario. Permite gestionar el perfil, la cuenta, los favoritos y otras opciones de configuración.
 * Muestra un menú lateral para navegar entre las diferentes secciones de configuración, y cada sección se renderiza condicionalmente según la opción seleccionada.
 * @returns 
 */
const UserSettings = () => {
  const { user }                    = useContext(AuthContext);
  const navigate                    = useNavigate();
  const [activeSection, setSection] = useState('profile');

  if (!user) { navigate('/Login'); return null; }

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
                onClick={() => setSection(s.key)}
              >
                <span className="sidebar-icon">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>

          <main>
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'account' && <AccountSection />}
            {activeSection === 'Favs'  && <FavoritesSection />}
            {activeSection === 'danger'  && <DangerSection />}
          </main>
        </div>

      </div>
    </div>
  );
};

export default UserSettings;