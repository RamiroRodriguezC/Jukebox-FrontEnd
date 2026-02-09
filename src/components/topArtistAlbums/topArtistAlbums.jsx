import React from 'react';
import AlbumCard from '../cards/AlbumCard';
import './topArtistAlbums.css';

const TopAlbumsSection = ({albums}) => {
  return (
    <section className="topAlbums-section">
      <h3 className="section-title">Álbumes Destacados</h3>
      {/* Bloque de Resumen de Rating */}
      <div className="albums-grid">
          {albums.map((album) => (
            <AlbumCard album={album} />
          ))}
      </div>
        
      <button className="btn-see-more">Ver todas los albunes</button>
    </section>
  );
};

export default TopAlbumsSection;