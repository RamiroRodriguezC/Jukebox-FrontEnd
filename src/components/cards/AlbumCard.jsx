/*
  Este componente muestra una tarjeta para un álbum, con su portada, título, autores y año de lanzamiento.
  Recibe un objeto "album" como prop, que contiene toda esta información. 
  Si el álbum no tiene una portada, se muestra una imagen genérica.
  Al hacer clic en la tarjeta, se redirige a la página de detalles del álbum.
*/

// IMPORTS
import { Card, Tag } from 'antd';
import genericAlbum from '../../assets/genericAlbum.png';
import './Cards.css';
import { Link } from 'react-router-dom';
//


const AlbumCard = ({ album }) => {
  // Desestructuring de las propiedades del álbum para usarlas más fácilmente.
  const { titulo, anio, url_portada, autores } = album;

  return (

    // Envolvemos la tarjeta en un Link para que sea clickeable y redirija a la página de detalles del álbum. La URL se construye usando el ID del álbum.
    <Link to={`/album/${album._id}`} style={{ textDecoration: 'none' }}> 
    {/* Usamos el componente Card, de AntDesign */}
    <Card
      hoverable
      className="card-base"
      cover={
        <img 
          alt={titulo} 
          src={url_portada || genericAlbum} // buscamos la portada del album, si no existe mostramos la generica
          className="card-image" 
        />
      }
    >
     {/* El Meta del Card es un subcomponente diseñado para mostrar la info de las cards */}
      <Card.Meta 
        title={<span className="card-title">{titulo}</span>} 
        /* Solo si el album tiene autores mostramos el subtitle, que es un span con la clase card-subtitle. 
        autores.map(a => a.nombre) mapea los nombres en un array, y .join(', ') lo convierte en un string separado por comas*/ 
        description={autores && <span className="card-subtitle">{autores.map(a => a.nombre).join(', ')}</span>} 
      />
      <div> 
      <Tag className="card-tag">Album</Tag>
        <Tag color="blue" style={{ borderRadius: '4px', border: 'none', backgroundColor: '#334155', color: '#94a3b8' }}>
          {anio}
        </Tag>
      </div>
    </Card>
    </Link>
  );
};

export default AlbumCard;