import React from 'react';
import AlbumCard from '../cards/AlbumCard';
import './TopArtistAlbums.css';

const TopAlbumsSection = ({albums}) => {
  if (!albums || albums.length === 0) return null;

  return (
    <section className="topAlbums-section">
      <h3 className="section-title">Álbumes Destacados</h3>
      
      {/* Si en 'topArtistAlbums.css' la clase 'albums-grid' tiene 
         grid-template-columns: repeat(2, 1fr), eso es lo que rompe todo.
         Para desktop debería ser 1 sola columna.
      */}
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