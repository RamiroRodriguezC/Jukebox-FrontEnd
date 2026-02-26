/*
  Este componente muestra la sección "Sobre el Artista" en la página de detalles del artista.
  Recibe un objeto "artista" como prop, que contiene información sobre el artista, como su nombre, 
  país de origen, descripción y URL de la foto. 
*/

// IMPORTS
import React from 'react';
import './AboutArtistSection.css';
import '../../styles/Ui.css';

const AboutArtistSection = ({artista}) => {
  return (
    <section className="artist-about-section">
      <h2 className="section-title">Sobre {artista.nombre}</h2>
      
      <div className="about-card">
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