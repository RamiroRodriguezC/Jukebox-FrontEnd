import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, User } from 'lucide-react';
import ReviewSection from '../components/ReviewSection/ReviewSection';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TrackList from '../components/TrackList/TrackList';
import api from '../api/api.js';


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
        const songRes = await api.get(`/canciones/${id}`);
        const actualSong = songRes.data;
        setCancion(actualSong);

        // 2. Traemos las reviews de la canción
        const reviewsRes = await api.get(`/reviews/Cancion/${id}?limit=3`);
          
        setReviews(reviewsRes.data.docs);

        // 3. Buscamos el álbum completo para el Tracklist
        // Verificamos si existe el álbum y obtenemos su ID sea objeto o string
        const albumId = actualSong.album?._id || actualSong.album;

        if (albumId) {
          const albumRes = await api.get(`/albums/${albumId}`);
            const actualAlbum = albumRes.data;
            setAlbumTracks(actualAlbum.canciones || []);
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
          meta={`${cancion.generos?.join(", ")} • ${formatDuration(cancion.duracion || 0)} min`}

          variant="square"
        />

        {/* 2. GRID PRINCIPAL (Dividido en 2) */}

        {/* COLUMNA IZQUIERDA: REVIEWS */}
        <div className="d-content-grid">
          <div>
            <ReviewSection
              rating={rating}
              totalReviews={cancion.cantReseñas || mockReviews.length}
              reviews={reviews}
              emptyMessage="Aún no hay reseñas para esta canción."
              entityId={id}
              entityName={cancion.titulo}
              entityType="Cancion"
            />
          </div>
          {/* COLUMNA DERECHA: TRACKLIST (Simple) */}
          <TrackList canciones={albumTracks} currentTrackId={cancion._id} />

        </div>
      </div>
    </div>
  );
};

export default SongDetail;