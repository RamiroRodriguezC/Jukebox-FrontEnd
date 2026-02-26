import { Card, Typography, Tag } from 'antd';
import genericAlbum from '../../assets/genericAlbum.png';
const { Text } = Typography;

// TrackCard.jsx
const TrackCard = ({ cancion }) => {
  // album:{ url_portada} = {} es un destructuring anidado con valor por defecto. 
  // intentamos extraer url_portada de cancion.album, pero si cancion.album es undefined, 
  // en vez de tirar error, le asignamos un objeto vacío {} para que el destructuring no falle. 
  const { titulo,duracion, album:{ url_portada} = {}, autores} = cancion;
  const formatTime = (s) => (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;

  return (
    <Card
      hoverable
      className="card-base"
      cover={
        <img 
          src={url_portada || genericAlbum} // Si la canción tiene un álbum con portada, la mostramos. Si no, mostramos una imagen genérica.
          alt="Portada" 
          className="card-image"
        />
      }
    >
      {/* El Meta del Card es un subcomponente diseñado para mostrar la info de las cards */}
      <Card.Meta 
        title={<span className="card-title">{titulo}</span>} 
        /* Solo si el album tiene autores mostramos el subtitle, que es un span con la clase card-subtitle. 
        autores.map(a => a.nombre) mapea los nombres en un array, y .join(', ') lo convierte en un string separado por comas*/ 
        description={<span className="card-subtitle">{autores.map(a => a.nombre).join(', ')}</span>} 
      />
      
      <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag className="card-tag">Canción</Tag>
        <Text style={{ color: '#94a3b8', fontSize: '12px' }}>{formatTime(duracion)}</Text>
      </div>
    </Card>
  );
};


export default TrackCard;