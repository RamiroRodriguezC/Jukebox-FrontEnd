import React from 'react';
import { Star } from 'lucide-react'; 
import ReviewCard from '../cards/AlbumCard';
import './topArtistAlbums.css';

const topAlbumsSection = ({albums}) => {
  return (
    <section className="topAlbums-section">
      
      {/* Bloque de Resumen de Rating */}
      <div className="albums.list">
        {albums.length > 0 ? (
          albums.map((album) => (
            <AlbumCard album={album} />
          ))
        ) : (
          <p className="empty-message">{emptyMessage}</p>
        )}
      </div>
        
      <button className="btn-see-more">Ver todas los albunes</button>
    </section>
  );
};

export default ReviewSection;