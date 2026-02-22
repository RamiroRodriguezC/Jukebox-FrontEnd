import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import AlbumCard from '../../../components/cards/AlbumCard';
import api from '../../../api/api';

const AlbumesRecientes = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/albums?limit=6')
      .then(res => setAlbums(res.data.docs || []))
      .catch(err => console.error('Error cargando álbumes:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#64748b' }}>Cargando álbumes...</p>;

  return (
    <section className="home-section">
      <div className="home-section__header">
        <h2 className="home-section__title">Álbumes recientes</h2>
      </div>

      <Row gutter={[16, 16]}>
        {albums.map(album => (
          <Col key={album._id} xs={12} sm={8} md={6} lg={4}>
            <AlbumCard album={album} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default AlbumesRecientes;