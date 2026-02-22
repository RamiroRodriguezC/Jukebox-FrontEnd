import rockyImg from '../assets/Rocky/404NotFound.png';

const NotFound = () => {
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
        alt="404 Not Found" 
        style={{ maxWidth: '400px', height: 'auto' }} 
      />
      <p style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
        No hemos podido encontrar esta ruta (404)
      </p>
    </div>
  );
};

export default NotFound;