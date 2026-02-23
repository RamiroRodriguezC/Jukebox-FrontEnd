import React from 'react';
import './EntityHeader.css';
import { Link } from 'react-router-dom';

const EntityHeader = ({ 
  type,     // "Álbum", "Canción", "Artista", "User"
  title, 
  authors,  // Array de { nombre, _id } — opcional
  image, 
  meta,
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

        {authors?.length > 0 && (
          <div className="d-subtitle">
            {authors.map((author, i) => (
              <span key={author._id}>
                <Link to={`/artista/${author._id}`} className="d-author-link">
                  {author.nombre}
                </Link>
                {i < authors.length - 1 && <span className="d-author-sep">, </span>}
              </span>
            ))}
          </div>
        )}

        {meta && <p className="d-meta">{meta}</p>}
      </div>
    </header>
  );
};

export default EntityHeader;