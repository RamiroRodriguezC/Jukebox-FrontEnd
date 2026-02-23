import React from 'react';
import AlbumCard from '../cards/AlbumCard';
import { Link } from 'react-router-dom';
import './TopArtistAlbums.css';
import '../../styles/Ui.css';

const TopAlbumsSection = ({ albums, artistaId }) => {
  if (!albums || albums.length === 0) return null;

  return (
    <section className="topAlbums-section">
      <h3 className="section-title">Álbumes Destacados</h3>
      <div className="albums-grid">
        {albums.map((album) => (
          <AlbumCard key={album._id || album.id} album={album} />
        ))}
      </div>
      {artistaId && (
        <Link to={`/artista/${artistaId}/albums`}>
          <button className="btn-see-more">Ver todos los álbumes</button>
        </Link>
      )}
    </section>
  );
};

export default TopAlbumsSection;