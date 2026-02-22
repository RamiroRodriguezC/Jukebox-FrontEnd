import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection/ReviewSection';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TrackList from '../components/TrackList/TrackList';
import useFetch from '../hooks/useFetch';
import './Detail.css';

const AlbumDetail = () => {
  const { id } = useParams();

  const { data: album, loading, error } = useFetch(`/albums/${id}`, [id]);
  const { data: reviewsData, loading: loadingReviews } = useFetch(`/reviews/Album/${id}?limit=3`, [id]);

  const reviews    = reviewsData?.docs || [];
  const coverImage = album?.url_portada || `https://placehold.co/400x400/222/fff?text=${album?.titulo || 'Album'}`;
  const artistName = album?.autores?.map(a => a.nombre).join(', ') || 'Artista Desconocido';
  const rating     = album?.promedioRating || 0;

  if (loading || loadingReviews) return <div className="loading-screen">Cargando...</div>;
  if (error)  return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;
  if (!album) return null;

  return (
    <div className="detail-container">
      <div className="d-main-content">

        <EntityHeader
          type="Álbum"
          title={album.titulo}
          subtitle={<p className="d-artist">{artistName}</p>}
          image={coverImage}
          meta={`${album.anio || 'N/A'} • ${album.generos?.join(', ') || 'Sin género'} • ${album.canciones?.length || 0} canciones`}
          variant="square"
        />

        <div className="d-content-grid">
          <div>
            <ReviewSection
              rating={rating}
              totalReviews={album.cantReseñas || 0}
              reviews={reviews}
              emptyMessage="Aún no hay reseñas para este álbum."
              entityId={id}
              entityName={album.titulo}
              entityType="Album"
            />
          </div>
          <TrackList canciones={album.canciones || []} />
        </div>

      </div>
    </div>
  );
};

export default AlbumDetail;