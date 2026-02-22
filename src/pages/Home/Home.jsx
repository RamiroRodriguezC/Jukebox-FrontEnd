import { useAuth } from '../../context/AuthContext';
import Hero from './components/Hero';
import AlbumesRecientes from './components/AlbumesRecientes';
import ArtistasDestacados from './components/ArtistasDestacados';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <Hero />
      {user && (
        <div className="home-sections">
          <AlbumesRecientes />
          <ArtistasDestacados />
        </div>
      )}
    </div>
  );
};

export default Home;