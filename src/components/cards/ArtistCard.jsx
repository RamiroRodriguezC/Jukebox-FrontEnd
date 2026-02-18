import { Card, Avatar, Typography, Tag } from 'antd';
import genericArtist from '../../assets/genericArtist.png';
import './Cards.css';
const { Text } = Typography;

const ArtistCard = ({ artista }) => {
  return (
    <Card
      hoverable
      className="card-base"
      cover={
        <div className="card-image-wrapper" style={{ background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar 
            size={120} 
            src={artista.url_foto || genericArtist} 
            srcSet={artista.url_foto}
            style={{ flexShrink: 0 }}
          />
        </div>
      }
    >
      <Card.Meta 
        title={<span className="card-title">{artista.nombre}</span>} 
      />
      <div> 
        <Tag className="card-tag">Artist</Tag>
      </div>
      <Text style={{ color: '#94a3b8', display: 'block', fontSize: '12px' }}>{artista.pais}</Text>
    </Card>
  );
};

export default ArtistCard;