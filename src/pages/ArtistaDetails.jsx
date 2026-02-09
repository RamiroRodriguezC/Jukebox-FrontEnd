import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TopAlbumsSection from '../components/TopArtistAlbums/TopArtistAlbums';
import AboutArtistSection from '../components/AboutArtistSection/AboutArtistSection';
import TopTracksSection from '../components/TopTracksSection/TopTracksSection';


const API_URL = 'https://jukebox-rpt0.onrender.com'; 

// Importamos el CSS
import './Detail.css';

const ArtistaDetail = () => {
  const { id } = useParams();
  const [artista, setArtista] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtista = async () => {
      try {
        const response = await fetch(`${API_URL}/artistas/${id}`);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.msg || 'Error al cargar el artista');
        }

        const albumsRes = await fetch(`${API_URL}/albums/artista/${id}`);
        if (!albumsRes.ok) {
          console.warn('No se pudieron cargar los álbumes del artista');
        } 
        const albumsData = await albumsRes.json();
        setAlbums(albumsData.data || albumsData );


        const data = await response.json();
        setArtista(data.data || data);

      } catch (err) {
        console.error("Error fetching artista:", err);
        setError('Artista no encontrado o error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchArtista();
  }, [id]);

  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;

  // Datos procesados con fallbacks seguros
  const coverImage = artista?.url_foto || `https://placehold.co/400x400/222/fff?text=${artista?.nombre || 'Artista'}`;

  return (
    <div className="detail-container">

      <div className="d-main-content">

        {/* 1. HEADER SUPERIOR (Portada y Título) */}
        <EntityHeader
          type="Artista"
          title={artista.nombre}
          image={coverImage}
          variant="circle"
        />

        {/* 2. GRID PRINCIPAL (Dividido en 2) */}

        {/* COLUMNA IZQUIERDA: REVIEWS */}
        <div className="d-content-grid">
          <TopAlbumsSection albums={albums} />
        

        {/* COLUMNA DERECHA: ABOUT & TOP TRACKS */}
        <div>
          <AboutArtistSection artista={artista} />
          <TopTracksSection artistaId={id} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistaDetail;