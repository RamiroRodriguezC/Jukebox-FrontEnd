import React from 'react';
import './TrackList.css';

const TrackList = ({ canciones = [], currentTrackId }) => {

  // Helper para formatear la duración (lo movemos aquí para que el componente sea independiente)
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (

    <section className="tracklist-section">
      <h3 className="tracklist-title">Canciones</h3>

      <div className="track-list-container">
        {canciones && canciones.length > 0 ? (
          canciones.map((cancion, index) => (
            <div key={cancion._id || index} className={`track-row ${currentTrackId === cancion._id ? 'active-track' : ''}`}>
              <div className="track-num">{index + 1}</div>
              <div className="track-name">{cancion.titulo}</div>
              <div className="track-dur">{formatDuration(cancion.duracion)}</div>
            </div>
          ))
        ) : (
          <p className="tracklist-empty">Sin canciones registradas.</p>
        )}
      </div>
    </section>
  );
};

export default TrackList;
