import { Card, Typography, Tag } from 'antd';
import genericAlbum from '../assets/genericAlbum.png';
const { Text } = Typography;

const TrackCard = ({ cancion }) => {
  // Formatear segundos a mm:ss
  const formatTime = (s) => (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;

  return (
    <Card
      hoverable
      style={{ width: '100%', backgroundColor: '#1e293b', border: 'none' }}
      cover={<img src={cancion.album.url_portada || genericAlbum } alt="Portada" style={{ height: 180, objectFit: 'cover' }} />}
    >
      <Text strong style={{ color: '#f8fafc', display: 'block' }}>{cancion.titulo}</Text>
      <Text style={{ color: '#38bdf8', display: 'block' }}>{cancion.autores[0].nombre}</Text>
      
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color="cyan">Canción</Tag>
        <Text style={{ color: '#94a3b8', fontSize: '12px' }}>{formatTime(cancion.duracion)}</Text>
      </div>
    </Card>
  );
};

export default TrackCard;