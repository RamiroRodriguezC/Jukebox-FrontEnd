import { message } from 'antd';

const DangerSection = () => (
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

export default DangerSection;