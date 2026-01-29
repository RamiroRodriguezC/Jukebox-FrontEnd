import { Card, Avatar, Typography, Tag } from 'antd';
import genericArtist from '../assets/genericArtist.png';
const { Text } = Typography;

const ArtistCard = ({ artista }) => {
  return (
    <Card
      hoverable
      style={{ width: '100%', textAlign: 'center', backgroundColor: '#1e293b', border: 'none' }}
    >
      <Avatar size={250} src={artista.url_foto || genericArtist } srcSet={artista.url_foto} />
      <div style={{ marginTop: 15 }}>
        <Text strong style={{ color: '#f8fafc', display: 'block', fontSize: '16px' }}>
          {artista.nombre}
        </Text>
        <Tag color="purple" style={{ marginTop: 8 }}>Artista</Tag>
        <Text style={{ color: '#94a3b8', display: 'block', fontSize: '12px' }}>{artista.pais}</Text>
      </div>
    </Card>
  );
};

export default ArtistCard;