import React from 'react';
import AlbumCard from '../cards/AlbumCard';
import './AboutArtistSection.css';

const AboutArtistSection = ({artista}) => {
  console.log("Datos del artista en About:", artista);
  return (
    <section className="artist-about-section">
      <h2 className="section-title">Sobre {artista.nombre}</h2>
      
      <div className="about-card">
        {/* Usamos la imagen de fondo con un degradado para que el texto resalte */}
        <div 
          className="about-image-bg" 
          style={{ backgroundImage: `url(${artista.url_foto || artista.url_portada})` }}
        >
          <div className="about-overlay">
            <div className="about-stats">
              <span className="origin-label">Origen</span>
              <p className="origin-country">{artista.pais || 'Internacional'}</p>
            </div>
            
            <div className="about-content">
              <p className="about-description">
                {artista.descripcion || "No hay una biografía disponible para este artista en este momento."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutArtistSection;