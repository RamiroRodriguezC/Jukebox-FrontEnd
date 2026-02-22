import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import rockyImg from '../../../assets/Rocky/sayingHi.png';

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className={`home-hero ${user ? 'home-hero--compact' : ''}`}>
      <div className="home-hero__content">

        <div className="home-hero__text">
          {user ? (
            <>
              <p className="home-hero__greeting">
                Hola, <span>{user.nombre}</span> 👋
              </p>
              <h1 className="home-hero__title">¿Qué estás<br />escuchando hoy?</h1>
            </>
          ) : (
            <>
              <h1 className="home-hero__title">Tu música.<br />Tu opinión.</h1>
              <p className="home-hero__subtitle">
                Descubrí álbumes, escuchá artistas y dejá tu huella con reseñas reales.
              </p>
              <div className="home-hero__cta">
                <Link to="/register" className="btn-hero btn-hero--primary">Crear cuenta gratis</Link>
                <Link to="/login"    className="btn-hero btn-hero--ghost">Iniciar sesión</Link>
              </div>
            </>
          )}
        </div>

        <div className="home-hero__rocky">
          <img src={rockyImg} alt="Rocky la Rocola" className="rocky-img" />
          {!user && <div className="rocky-bubble">¡Bienvenido a Jukebox!</div>}
        </div>

      </div>

      <div className="hero-glow hero-glow--1" />
      <div className="hero-glow hero-glow--2" />
    </section>
  );
};

export default Hero;