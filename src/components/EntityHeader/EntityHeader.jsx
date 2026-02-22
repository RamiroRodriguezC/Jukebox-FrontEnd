import React from 'react';
import './EntityHeader.css';
import { Link } from 'react-router-dom';

const EntityHeader = ({ 
  type,          // "Álbum", "Canción" o "Artista"
  title, 
  subtitle,      // Nombre del artista o del álbum
  subtitleLink,  // Link para el subtitle (opcional)
  image, 
  meta,          // El texto de año, géneros, etc.
  variant,
}) => {
  
  return (
    <header className={`d-hero ${type}`}>
      <div className={`d-cover-wrapper ${variant}`}>
        <img src={image} alt={title} className="d-cover-img" />
      </div>

      <div className="d-info">
        {type && <span className="d-type">{type}</span>}
        <h1 className={`d-title ${type}`}>{title}</h1>
        <Link to={`/${type}/${subtitleLink}`}>
          <div className="d-subtitle">{subtitle}</div>
        </Link>
        <p className="d-meta">{meta}</p>
      </div>
    </header>
  );
};

export default EntityHeader;