import React from 'react';
import { useParams } from 'react-router-dom';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TopAlbumsSection from '../components/TopArtistAlbums/TopArtistAlbums';
import AboutArtistSection from '../components/AboutArtistSection/AboutArtistSection';
import TopTracksSection from '../components/TopTracksSection/TopTracksSection';
import useFetch from '../hooks/useFetch';
import './Detail.css';

const ArtistaDetail = () => {
  const { id } = useParams();

  const { data: artista, loading, error } = useFetch(`/artistas/${id}`, [id]);
  const { data: albumsData               } = useFetch(`/albums/artista/${id}?limit=4`, [id]);

  const albums     = albumsData?.docs || albumsData || [];
  const coverImage = artista?.url_foto || `https://placehold.co/400x400/222/fff?text=${artista?.nombre || 'Artista'}`;

  if (loading)  return <div className="loading-screen">Cargando...</div>;
  if (error)    return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;
  if (!artista) return null;

  return (
    <div className="detail-container">
      <div className="d-main-content">

        <EntityHeader
          type="Artista"
          title={artista.nombre}
          image={coverImage}
          variant="circle"
        />

        <div className="d-content-grid">
          <TopAlbumsSection albums={albums} artistaId={id} />

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