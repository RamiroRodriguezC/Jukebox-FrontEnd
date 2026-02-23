import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import AlbumCard from '../components/cards/AlbumCard';
import useFetch from '../hooks/useFetch';
import genericAlbum from '../assets/genericAlbum.png';
import './ArtistaAlbums.css';
import '../pages/Detail.css';

const ArtistaAlbums = () => {
  const { id } = useParams();

  const { data: artista, loading: loadingArtista, error } = useFetch(`/artistas/${id}`, [id]);
  const { data: albumsData, loading: loadingAlbums } = useFetch(`/albums/artista/${id}`, [id]);

  const albums = useMemo(() => {
    const raw = albumsData?.docs || albumsData || [];
    return [...raw].sort((a, b) => (b.anio || 0) - (a.anio || 0));
  }, [albumsData]);

  const topAlbum = useMemo(() => {
    if (!albums.length) return null;
    return [...albums].sort((a, b) => (b.promedioRating || 0) - (a.promedioRating || 0))[0];
  }, [albums]);

  const stats = useMemo(() => {
    if (!albums.length) return null;
    const years = albums.map(a => a.anio).filter(Boolean);
    const ratings = albums.map(a => a.promedioRating).filter(Boolean);
    return {
      total:     albums.length,
      firstYear: Math.min(...years),
      lastYear:  Math.max(...years),
      avgRating: ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : '—',
    };
  }, [albums]);

  if (loadingArtista || loadingAlbums) return <div className="loading-screen">Cargando...</div>;
  if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;
  if (!artista) return null;

  return (
    <div className="detail-container">
      <div className="d-main-content">

        {/* Breadcrumb */}
        <div className="aa-breadcrumb">
          <Link to={`/artista/${id}`} className="aa-breadcrumb__link">
            ← {artista.nombre}
          </Link>
          <span className="aa-breadcrumb__sep">/</span>
          <span className="aa-breadcrumb__current">Discografía</span>
        </div>

        {/* Hero — álbum mejor valorado */}
        {topAlbum && (
          <section className="aa-hero">
            <div className="aa-hero__bg" style={{ backgroundImage: `url(${topAlbum.url_portada})` }} />
            <div className="aa-hero__overlay" />
            <div className="aa-hero__content">
              <span className="aa-hero__label">⭐ Mejor valorado</span>
              <Link to={`/album/${topAlbum._id}`} className="aa-hero__title">
                {topAlbum.titulo}
              </Link>
              <div className="aa-hero__meta">
                <span className="aa-hero__year">{topAlbum.anio}</span>
                {topAlbum.promedioRating > 0 && (
                  <span className="aa-hero__rating">★ {topAlbum.promedioRating.toFixed(1)}</span>
                )}
                {topAlbum.generos?.length > 0 && (
                  <span className="aa-hero__genres">{topAlbum.generos.join(' · ')}</span>
                )}
              </div>
              <Link to={`/album/${topAlbum._id}`} className="btn-hero btn-hero--primary aa-hero__btn">
                Ver álbum
              </Link>
            </div>
            <div className="aa-hero__cover-wrapper">
              <img src={topAlbum.url_portada || genericAlbum} alt={topAlbum.titulo} className="aa-hero__cover" />
            </div>
          </section>
        )}

        {/* Estadísticas */}
        {stats && (
          <section className="aa-stats">
            <div className="aa-stat">
              <span className="aa-stat__value">{stats.total}</span>
              <span className="aa-stat__label">Álbumes</span>
            </div>
            <div className="aa-stat-divider" />
            <div className="aa-stat">
              <span className="aa-stat__value">{stats.firstYear}</span>
              <span className="aa-stat__label">Primer álbum</span>
            </div>
            <div className="aa-stat-divider" />
            <div className="aa-stat">
              <span className="aa-stat__value">{stats.lastYear}</span>
              <span className="aa-stat__label">Último álbum</span>
            </div>
            <div className="aa-stat-divider" />
            <div className="aa-stat">
              <span className="aa-stat__value">★ {stats.avgRating}</span>
              <span className="aa-stat__label">Rating promedio</span>
            </div>
          </section>
        )}

        {/* Grid de álbumes */}
        <section className="aa-grid-section">
          <h2 className="aa-grid-title">Discografía completa</h2>
          <div className="aa-grid">
            {albums.map(album => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ArtistaAlbums;