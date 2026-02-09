import { Card, Typography, Tag } from 'antd';
import genericAlbum from '../../assets/genericAlbum.png';
import './Cards.css';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const { Text, Title } = Typography;

const AlbumCard = ({ album }) => {
  // Extraemos los datos según el esquema de Mongoose
  const { titulo, anio, url_portada, autores } = album;

  return (
    <Link to={`/album/${album._id}`} style={{ textDecoration: 'none' }}>
    <Card
      hoverable
      className="card-base"
      cover={
        <img 
          alt={album.titulo} 
          src={album.url_portada || genericAlbum} 
          className="card-image" 
        />
      }
    >
      <Card.Meta 
        title={<span className="card-title">{album.titulo}</span>} 
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