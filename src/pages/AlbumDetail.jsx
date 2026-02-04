import React from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, Divider, Empty } from 'antd';
import { StarFilled, ClockCircleOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
// Asegurate de que la ruta a tu archivo de datos sea correcta
import { MOCK_ALBUMS } from '../utils/mockData'; 
import './AlbumDetail.css';

const { Title, Text } = Typography;

const AlbumDetalle = () => {
  const { id } = useParams();

  // Buscamos el álbum directamente en el renderizado
  const album = MOCK_ALBUMS.find(a => String(a._id) === String(id));

  // Si no existe el álbum, mostramos un estado vacío en lugar de carga infinita
  if (!album) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', background: '#0f172a', minHeight: '100vh' }}>
        <Empty description={<span style={{color: 'white'}}>Álbum no encontrado (ID: {id})</span>} />
      </div>
    );
  }

  return (
    <div className="album-detail-container">
      <div className="album-header">
        <img src={album.url_portada} alt={album.titulo} className="header-cover" />
        <div className="header-info">
          <Title className="header-title">{album.titulo}</Title>
          <Title level={3} style={{ color: '#6366f1', margin: 0 }}>{album.artista}</Title>
          <div className="header-meta">
            <Text style={{ color: '#94a3b8' }}>
              {album.anio} • {album.generos?.join(', ')} • <ClockCircleOutlined /> {album.duracion}
            </Text>
          </div>
        </div>
      </div>

      <Divider style={{ borderColor: '#334155' }} />

      <Row gutter={[48, 24]}>
        <Col xs={24} md={10}>
          <Title level={4} style={{ color: 'white' }}>Rating y Estadísticas</Title>
          <div className="rating-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Rate disabled allowHalf
                value={album.rating}
                style={{fontSize: 32 }} // Estrellas rojas y grandes
              />
              <span className="rating-number">{album.rating}</span>
            </div>
            <Text style={{ color: '#94a3b8' }}>({album.votos} Votos)</Text>
            <br />
            <button className="btn-reviews">Leer Reseñas</button>
          </div>
        </Col>

        <Col xs={24} md={14}>
          <Title level={4} style={{ color: 'white' }}>Tracklist</Title>
          <div className="tracklist-container">
            {album.canciones?.map((track, index) => (
              <div key={index} className="track-item-mock">
                <span className="track-name">{index + 1}. {track.nombre}</span>
                <span className="track-time">{track.duracion}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AlbumDetalle;