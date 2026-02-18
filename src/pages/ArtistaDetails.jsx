import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TopAlbumsSection from '../components/TopArtistAlbums/TopArtistAlbums';
import AboutArtistSection from '../components/AboutArtistSection/AboutArtistSection';
import TopTracksSection from '../components/TopTracksSection/TopTracksSection';
import api from '../api/api.js';


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
        const response = await api.get(`/artistas/${id}`);
        console.log("Respuesta del artista:", api.baseURL);

        const albumsRes = await api.get(`/albums/artista/${id}?limit=4`);
        setAlbums(albumsRes.data.docs || albumsRes.data);


        const data = response.data.data || response.data;
        setArtista(data);

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

        {/* COLUMNA IZQUIERDA: Top albums */}
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