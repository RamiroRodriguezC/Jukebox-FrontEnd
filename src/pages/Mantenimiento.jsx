import rockyImg from '../assets/Rocky/inMaintenance.png';

const Mantenimiento = () => {
  return (
    <div 
      className="not-found" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '80vh', // Para que esté centrado verticalmente en la pantalla
        gap: '20px'        // Esto controla la separación exacta entre imagen y texto
      }}
    >
      <img 
        src={rockyImg}
        alt="In Maintenance" 
        style={{ maxWidth: '400px', height: 'auto' }} 
      />
      <p style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
        ¡Cuidado! Estamos trabajando en esta sección. Vuelve pronto para descubrir nuevas funciones y mejoras. 🚧
      </p>
    </div>
  );
};

export default Mantenimiento;