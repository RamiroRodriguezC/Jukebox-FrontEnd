import { Card, Typography, Tag } from 'antd';
import genericAlbum from '../../assets/genericAlbum.png';
const { Text } = Typography;

// TrackCard.jsx
const TrackCard = ({ cancion }) => {
  const formatTime = (s) => (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;

  return (
    <Card
      hoverable
      className="card-base"
      cover={
        <img 
          src={cancion.album.url_portada || genericAlbum} 
          alt="Portada" 
          className="card-image"
        />
      }
    >
      <Card.Meta 
        title={<span className="card-title">{cancion.titulo}</span>} 
        description={<span className="card-subtitle">{cancion.autores.map(a => a.nombre).join(', ')}</span>} 
      />
      
      <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag className="card-tag">Canción</Tag>
        <Text style={{ color: '#94a3b8', fontSize: '12px' }}>{formatTime(cancion.duracion)}</Text>
      </div>
    </Card>
  );
};


export default TrackCard;