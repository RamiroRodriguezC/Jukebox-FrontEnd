import { Card, Typography, Tag } from 'antd';
import genericAlbum from '../assets/genericAlbum.png';

const { Meta } = Card;
const { Text, Title } = Typography;

const AlbumCard = ({ album }) => {
  // Extraemos los datos según tu esquema de Mongoose
  const { titulo, anio, url_portada, autores } = album;

  return (
    <Card
      hoverable
      style={{ 
        width: '100%', // Se adapta al tamaño de la columna de AntD
        backgroundColor: '#1e293b', 
        border: 'none',
        borderRadius: '12px',
        overflow: 'hidden' 
      }}
      cover={
        <img 
          alt={`Portada de ${titulo}`} 
          src={url_portada || genericAlbum} 
          style={{ height: 250, objectFit: 'cover' }}
        />
      }
    >
      <div style={{ marginBottom: '8px' }}>
        <Title level={5} style={{ color: '#f8fafc', margin: 0, fontSize: '16px' }}>
          {titulo}
        </Title>
        <Text style={{ color: '#38bdf8', display: 'block', fontWeight: '500' }}>
          {/* Mostramos todos los autores separados por coma */}
          {autores.map(a => a.nombre).join(', ')}
        </Text>
      </div>
      <div> 
      <Tag color="purple" style={{ marginTop: 8 }}>Album</Tag>
        <Tag color="blue" style={{ borderRadius: '4px', border: 'none', backgroundColor: '#334155', color: '#94a3b8' }}>
          {anio}
        </Tag>
      </div>
    </Card>
  );
};

export default AlbumCard;