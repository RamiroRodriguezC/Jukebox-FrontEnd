import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, User } from 'lucide-react';
import ReviewSection from '../components/reviewSection/ReviewSection';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TrackList from '../components/TrackList/TrackList';

// --- CONFIGURACIÓN DE LA API ---
// IMPORTANTE: En tu entorno local con Vite, puedes usar:
// const API_URL = import.meta.env.VITE_API_URL;
// Para este ejemplo, usamos una cadena directa:
const API_URL = 'https://jukebox-rpt0.onrender.com'; // <--- CAMBIA ESTO POR TU URL REAL

// Importamos el CSS
import './Detail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // Nuevo estado para las reseñas reales

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

        // Traemos las reviews del album
        const reviewsRes = await fetch(`${API_URL}/reviews/Album/${id}?limit=3`);

        // el ok significa que el backend devolvio un 200, osea que la consulta fue exitosa.
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          // Dependiendo de cómo devuelva los datos tu globalService, 
          // podrías necesitar reviewsData.docs o simplemente reviewsData
          setReviews(reviewsData.docs || reviewsData);
        }

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

  return (
    <div className="detail-container">

      <div className="d-main-content">

        {/* 1. HEADER SUPERIOR (Portada y Título) */}
        <EntityHeader
          type="Álbum"
          title={album.titulo}
          subtitle={<p className="d-artist">{artistName}</p>}
          image={coverImage}
          meta={`${album.anio} • ${album.generos?.join(", ")} • ${album.canciones?.length || 0} canciones`}
          
          variant="square"
        />

        {/* 2. GRID PRINCIPAL (Dividido en 2) */}

        {/* COLUMNA IZQUIERDA: REVIEWS */}
        <div className="d-content-grid">
          <ReviewSection
            rating={rating}
            totalReviews={album.cantReseñas || mockReviews.length}
            reviews={reviews}
            emptyMessage="Aún no hay reseñas para este álbum."
          />


          {/* COLUMNA DERECHA: TRACKLIST (Simple) */}
          <TrackList canciones={album.canciones} />

        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;