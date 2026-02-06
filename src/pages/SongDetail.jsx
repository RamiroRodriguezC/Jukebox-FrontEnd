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

const SongDetail = () => {
    const { id } = useParams();
    const [cancion, setCancion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]); // Nuevo estado para las reseñas reales
    const [albumTracks, setAlbumTracks] = useState([]);

useEffect(() => {
  const fetchSongAndAlbum = async () => {
    try {
      // 1. Buscamos la canción actual
      const songRes = await fetch(`${API_URL}/canciones/${id}`);
      const songData = await songRes.json();
      
      // Ajuste según tu API: ¿Es songData o songData.data?
      const actualSong = songData.data || songData; 
      setCancion(actualSong);

      // 2. Traemos las reviews de la canción
      const reviewsRes = await fetch(`${API_URL}/reviews/Cancion/${id}?limit=3`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.docs || reviewsData.data || reviewsData);
      }

      // 3. Buscamos el álbum completo para el Tracklist
      // Verificamos si existe el álbum y obtenemos su ID sea objeto o string
      const albumId = actualSong.album?._id || actualSong.album;

      if (albumId) {
        // ¡OJO! Aquí debe ser la ruta de ALBUMS, no de REVIEWS
        const albumRes = await fetch(`${API_URL}/albums/${albumId}`);
        if (albumRes.ok) {
          const albumData = await albumRes.json();
          const actualAlbum = albumData.data || albumData;
          setAlbumTracks(actualAlbum.canciones || []);
        }
      }

    } catch (err) {
      console.error("Error fetching song:", err);
      setError('Canción no encontrada o error de conexión');
    } finally {
      setLoading(false);
    }
  };
  fetchSongAndAlbum();
}, [id]);

    if (loading) return <div className="loading-screen">Cargando...</div>;
    if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;

    // Datos procesados con fallbacks seguros
    const coverImage = cancion?.album.url_portada || `https://placehold.co/400x400/222/fff?text=${cancion.album?.titulo || 'Canción'}`;
    const artistName = cancion?.autores?.map(a => a.nombre).join(", ") || "Artista Desconocido";
    const rating = cancion?.promedioRating || 0;

    const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <div className="detail-container">

            <div className="d-main-content">

                {/* 1. HEADER SUPERIOR (Portada y Título) */}
                <EntityHeader
                    type="Canción"
                    title={cancion.titulo}
                    subtitle={<p className="d-artist">{artistName}</p>}
                    image={coverImage}
                    meta={`${cancion.anio} • ${cancion.generos?.join(", ")} • ${formatDuration(cancion.duracion || 0)} min`}

                    variant="square"
                />

                {/* 2. GRID PRINCIPAL (Dividido en 2) */}

                {/* COLUMNA IZQUIERDA: REVIEWS */}
                <div className="d-content-grid">
                    <ReviewSection
                        rating={rating}
                        totalReviews={cancion.cantReseñas || mockReviews.length}
                        reviews={reviews}
                        emptyMessage="Aún no hay reseñas para este álbum."
                    />


                    {/* COLUMNA DERECHA: TRACKLIST (Simple) */}
                    <TrackList canciones={albumTracks} currentTrackId={cancion._id} />

                </div>
            </div>
        </div>
    );
};

export default SongDetail;