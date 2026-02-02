import { Card, Avatar, Typography, Tag } from 'antd';
import genericArtist from '../../assets/genericArtist.png';
const { Text } = Typography;

const ArtistCard = ({ artista }) => {
  return (
    <Card
          hoverable
          className="card-base"
          styles={{ body: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }}
        >
          <Avatar size={100} src={artista.url_foto || genericArtist } srcSet={artista.url_foto} />
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