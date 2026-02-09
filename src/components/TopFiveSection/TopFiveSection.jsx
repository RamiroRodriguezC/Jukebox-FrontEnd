import React from 'react';
import AlbumCard from '../cards/AlbumCard';
import SongCard from '../cards/TrackCard';
import './TopFiveSection.css';

const TopFiveSection = ({ title, items, type, isOwner, onEdit }) => {
  // Aseguramos que siempre vea máximo 5, por más que la lista sea larga
  const topItems = items?.slice(0, 5) || [];

  return (
    <section className="top-five-container">
      <div className="top-five-header">
        <div className="title-group">
          <h2 className="top-five-title">{title}</h2>
          <span className="top-five-badge">TOP 5</span>
        </div>
        {isOwner && (
          <button className="btn-edit-top" onClick={onEdit}>
            Gestionar lista
          </button>
        )}
      </div>

      <div className="top-five-grid">
        {topItems.length > 0 ? (
          topItems.map((item, index) => (
            <div key={item._id} className="top-five-item">
              <span className="item-rank">{index + 1}</span>
              {type === 'album' ? (
                <AlbumCard album={item} />
              ) : (
                <SongCard song={item} />
              )}
            </div>
          ))
        ) : (
          <div className="top-five-empty">
            <p>No has seleccionado tus favoritos aún.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopFiveSection;