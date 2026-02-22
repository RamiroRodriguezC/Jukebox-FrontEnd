import React from 'react';
import AlbumCard from '../cards/AlbumCard';
import './TopArtistAlbums.css';
import '../../styles/Ui.css';

const TopAlbumsSection = ({albums}) => {
  if (!albums || albums.length === 0) return null;

  return (
    <section className="topAlbums-section">
      <h3 className="section-title">Álbumes Destacados</h3>
      <div className="albums-grid">
        {albums.map((album) => (
          <AlbumCard key={album._id || album.id} album={album} />
        ))}
      </div>
      <button className="btn-see-more">Ver todos los álbumes</button>
    </section>
  );
};

export default TopAlbumsSection;