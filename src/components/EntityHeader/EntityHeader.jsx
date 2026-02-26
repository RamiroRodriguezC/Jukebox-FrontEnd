import React from 'react';
import './EntityHeader.css';
import { Link } from 'react-router-dom';

/**
 *  Header reutilizable para las paginas de detalles de album, cancion, artista y usuario. Muestra la imagen de portada o foto, el título o nombre, los autores (si aplica) y otra información adicional.
 * 
 * @param {string} type - El tipo de entidad (Álbum, Canción, Artista, User)
 * @param {string} title - El título o nombre de la entidad
 * @param {Array<{ nombre: string, _id: string }>} authors - Un array de objetos con el nombre e ID de los autores (opcional)
 * @param {string} image - La URL de la imagen de portada o foto de la entidad
 * @param {string} meta - Información adicional para mostrar debajo del título (opcional)
 * @param {string} variant - Una variante de estilo para la imagen (opcional, puede ser "small", "medium", "large", etc.) 
 * Notese que los parametros son en realidad props que se le pasan al componente, pero los desestructuramos en la firma de la función para usarlos más fácilmente dentro del componente.
 * @returns 
 */
const EntityHeader = ({ 
  type,   
  title, 
  authors,  
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

        {/* Si tiene autores (album/cancion), agregamos al subtitulo cada uno, linkeandolo a su pagina artistaDetails */}
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
        {/* Si se paso el prop meta, lo mostramos debajo del título en un párrafo con la clase d-meta, que tiene un estilo más pequeño y gris. */}
        {meta && <p className="d-meta">{meta}</p>}
      </div>
    </header>
  );
};

export default EntityHeader;