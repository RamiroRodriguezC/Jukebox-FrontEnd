import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection/ReviewSection';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TrackList from '../components/TrackList/TrackList';
import api from '../api/api.js';

// Importamos el CSS
import './Detail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAlbumData = async () => {
      setLoading(true);
      try {
        // 1. Traemos el álbum con Axios
        // Nota: Axios tira error solo si el status no es 2xx, no hace falta el .ok
        const response = await api.get(`/albums/${id}`);
        const data = response.data.data || response.data;
        setAlbum(data);

        // 2. Traemos las reviews usando la misma instancia 'api'
        const reviewsRes = await api.get(`/reviews/Album/${id}?limit=3`);
        setReviews(reviewsRes.data.docs || []);

      } catch (err) {
        console.error("Error fetching album:", err);
        // Atajamos el error real del backend si existe
        const msg = err.response?.data?.message || 'Álbum no encontrado o error de conexión';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [id]);

  // Manejo de estados de carga y error (crucial para que no rompa el render)
  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;
  if (!album) return null;

  // Procesamos datos después de verificar que 'album' existe
  const coverImage = album.url_portada || `https://placehold.co/400x400/222/fff?text=${album.titulo || 'Album'}`;
  const artistName = album.autores?.map(a => a.nombre).join(", ") || "Artista Desconocido";
  const rating = album.promedioRating || 0;

  return (
    <div className="detail-container">
      <div className="d-main-content">
        
        {/* 1. HEADER SUPERIOR */}
        <EntityHeader
          type="Álbum"
          title={album.titulo}
          subtitle={<p className="d-artist">{artistName}</p>}
          image={coverImage}
          meta={`${album.anio || 'N/A'} • ${album.generos?.join(", ") || 'Sin género'} • ${album.canciones?.length || 0} canciones`}
          variant="square"
        />

        {/* 2. GRID PRINCIPAL (Respetando tus 2 columnas del CSS) */}
        <div className="d-content-grid">
          
          {/* COLUMNA IZQUIERDA: REVIEWS */}
          <div>
            <ReviewSection
              rating={rating}
              totalReviews={album.cantReseñas || reviews.length || 0}
              reviews={reviews}
              emptyMessage="Aún no hay reseñas para este álbum."
              entityId={id}
              entityName={album.titulo}
              entityType="Album"
            />
          </div> 

          {/* COLUMNA DERECHA: TRACKLIST */}
          <TrackList canciones={album.canciones || []} />

        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;