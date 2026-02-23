import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection/ReviewSection';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TrackList from '../components/TrackList/TrackList';
import useFetch from '../hooks/useFetch';
import './Detail.css';

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const SongDetail = () => {
  const { id } = useParams();

  const { data: cancion, loading, error } = useFetch(`/canciones/${id}`, [id]);
  const { data: reviewsData, loading: loadingReviews } = useFetch(`/reviews/Cancion/${id}?limit=3`, [id]);

  // Album fetch separado — depende del id de cancion, no bloquea reviews
  const albumId = cancion?.album?._id || cancion?.album;
  const { data: album } = useFetch(albumId ? `/albums/${albumId}` : null, [albumId]);

  const reviews    = reviewsData?.docs || [];
  const albumTracks = album?.canciones || [];
  const coverImage  = cancion?.album?.url_portada || `https://placehold.co/400x400/222/fff?text=${cancion?.album?.titulo || 'Canción'}`;
  const artistName  = cancion?.autores?.map(a => a.nombre).join(', ') || 'Artista Desconocido';
  const rating      = cancion?.promedioRating || 0;

  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (error)   return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;
  if (!cancion) return null;

  // Esperamos las reviews antes de montar ReviewSection para que initialReviews sea el valor final
  if (loadingReviews) return <div className="loading-screen">Cargando...</div>;

  return (
    <div className="detail-container">
      <div className="d-main-content">

        <EntityHeader
          type="Canción"
          title={cancion.titulo}
          authors={cancion.autores}
          image={coverImage}
          meta={`${cancion.generos?.join(', ')} • ${formatDuration(cancion.duracion)}`}
          variant="square"
        />

        <div className="d-content-grid">
          <div>
            <ReviewSection
              rating={rating}
              totalReviews={cancion.cantReseñas || 0}
              reviews={reviews}
              emptyMessage="Aún no hay reseñas para esta canción."
              entityId={id}
              entityName={cancion.titulo}
              entityType="Cancion"
            />
          </div>
          <TrackList canciones={albumTracks} currentTrackId={cancion._id} />
        </div>

      </div>
    </div>
  );
};

export default SongDetail;