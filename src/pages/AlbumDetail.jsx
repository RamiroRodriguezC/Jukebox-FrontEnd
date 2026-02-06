import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, User } from 'lucide-react';
import ReviewCard from '../components/cards/ReviewCard.jsx';

// --- CONFIGURACIÓN DE LA API ---
// IMPORTANTE: En tu entorno local con Vite, puedes usar:
// const API_URL = import.meta.env.VITE_API_URL;
// Para este ejemplo, usamos una cadena directa:
const API_URL = 'https://jukebox-rpt0.onrender.com'; // <--- CAMBIA ESTO POR TU URL REAL

// Importamos el CSS
import './AlbumDetail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper duración
  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        // Ajusta la ruta si tu backend usa plural '/albums'
        const response = await fetch(`${API_URL}/albums/${id}`);
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.msg || 'Error al cargar el álbum');
        }
        
        const data = await response.json();
        setAlbum(data.data || data);
      } catch (err) {
        console.error("Error fetching album:", err);
        setError('Álbum no encontrado o error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;

  // Datos procesados con fallbacks seguros
  const coverImage = album?.url_portada || `https://placehold.co/400x400/222/fff?text=${album?.titulo || 'Album'}`;
  const artistName = album?.autores?.map(a => a.nombre).join(", ") || "Artista Desconocido";
  const rating = album?.promedioRating || 0;

  // --- MOCK DE RESEÑAS (Para visualizar el diseño) ---
  const mockReviews = [
    { _id: 'rev1', autor: { username: 'musiclover', url_profile_photo: '' }, rating: 5, text: '¡Increíble álbum! Cada canción es una obra maestra.' },
    { _id: 'rev2', autor: { username: 'beatfan', url_profile_photo: '' }, rating: 4, text: 'Muy buen trabajo del artista, aunque algunas canciones son repetitivas.' },
    { _id: 'rev3', autor: { username: 'melody123', url_profile_photo: '' }, rating: 3, text: 'Está bien, pero esperaba más variedad en el estilo.' },
  ];

  return (
    <div className="album-detail-container">
      
      {/* Navbar */}
      <nav className="ad-nav">
        <Link to="/albums" className="ad-back-link">
          <ArrowLeft size={18} /> Volver
        </Link>
      </nav>

      <div className="ad-main-content">
        
        {/* 1. HERO SUPERIOR (Portada y Título) */}
        <header className="ad-hero">
          <div className="ad-cover-wrapper">
            <img src={coverImage} alt={album.titulo} className="ad-cover-img" />
          </div>
          
          <div className="ad-info">
            <span className="ad-type">Álbum</span>
            <h1 className="ad-title">{album.titulo}</h1>
            <p className="ad-artist">{artistName}</p>
            <p className="ad-meta">{album.anio} • {album.generos?.join(", ")} • {album.canciones?.length || 0} canciones</p>
          </div>
        </header>

        {/* 2. GRID PRINCIPAL (Dividido en 2) */}
        <div className="content-grid">
          
          {/* COLUMNA IZQUIERDA: RESEÑAS */}
          <section className="reviews-section">
            
            {/* Bloque de Resumen de Rating */}
            <div className="rating-summary-card">
              <div className="big-rating">{rating.toFixed(1)}</div>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < Math.round(rating) ? 'star-filled' : 'text-gray-600'} 
                  />
                ))}
              </div>
              <div className="total-reviews">Basado en {album.cantReseñas || mockReviews.length} reseñas</div>
            </div>

            {/* Lista de Reviews */}
            <div className="review-list">
              {mockReviews.slice(0, 3).map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            <button className="btn-see-more">Ver todas las reseñas</button>
          </section>

          {/* COLUMNA DERECHA: TRACKLIST (Simple) */}
          <section className="tracklist-section">
            <h3 className="tracklist-title">Canciones</h3>
            
            <div className="track-list-container">
              {album.canciones && album.canciones.length > 0 ? (
                album.canciones.map((cancion, index) => (
                  <div key={cancion._id} className="track-row">
                    <div className="track-num">{index + 1}</div>
                    <div className="track-name">{cancion.titulo}</div>
                    <div className="track-dur">{formatDuration(cancion.duracion)}</div>
                  </div>
                ))
              ) : (
                <p style={{color: '#666', textAlign:'center', marginTop: '20px'}}>Sin canciones registradas.</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;