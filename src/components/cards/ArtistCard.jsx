import { Card, Avatar, Typography, Tag } from 'antd';
import genericArtist from '../../assets/genericArtist.png';
import './Cards.css';
const { Text } = Typography;

/**
 * @param {object|null} artista - objeto con la información del artista a mostrar. Si es null, se muestra información genérica.
 * Este componente muestra una tarjeta para un artista, con su foto, nombre y país de origen.
 * Si el artista no tiene una foto, se muestra una imagen genérica.
 * Al hacer clic en la tarjeta, se redirige a la página de detalles del artista.
 */
const ArtistCard = ({ artista }) => {
  // Desestructuring de las propiedades del artista para usarlas más fácilmente.
  const { nombre,pais,url_foto } = artista;
  return (
    <Card
      hoverable
      className="card-base"
      cover={
        <div className="card-image-wrapper" style={{ background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar 
            size={120} 
            src={url_foto || genericArtist} //si hay foto del artista la mostramos, sino mostramos la genérica
            srcSet={url_foto}
            style={{ flexShrink: 0 }}
          />
        </div>
      }
    >
      {/* El Meta del Card es un subcomponente diseñado para mostrar la info de las cards */}
      <Card.Meta 
        title={<span className="card-title">{nombre}</span>} 
      />
      <div> 
        <Tag className="card-tag">Artist</Tag>
      </div>
      <Text style={{ color: '#94a3b8', display: 'block', fontSize: '12px' }}>{pais}</Text>
    </Card>
  );
};

export default ArtistCard;