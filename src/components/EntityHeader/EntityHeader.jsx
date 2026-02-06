import React from 'react';
import './EntityHeader.css';

const EntityHeader = ({ 
  type,          // "Álbum", "Canción" o "Artista"
  title, 
  subtitle,      // Nombre del artista o del álbum
  image, 
  meta,          // El texto de año, géneros, etc.
  variant = 'square' // 'square' para discos, 'circle' para artistas
}) => {
    const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  return (
    <header className="d-hero">
      <div className={`d-cover-wrapper ${variant}`}>
        <img src={image} alt={title} className="d-cover-img" />
      </div>

      <div className="d-info">
        {type && <span className="d-type">{type}</span>}
        <h1 className="d-title">{title}</h1>
        <div className="d-subtitle">{subtitle}</div>
        <p className="d-meta">{meta}</p>
      </div>
    </header>
  );
};

export default EntityHeader;