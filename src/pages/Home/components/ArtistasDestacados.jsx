import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import ArtistCard from '../../../components/cards/ArtistCard';
import api from '../../../api/api';

const ArtistasDestacados = () => {
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/artistas?limit=6')
      .then(res => setArtistas(res.data.docs || []))
      .catch(err => console.error('Error cargando artistas:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#64748b' }}>Cargando artistas...</p>;

  return (
    <section className="home-section">
      <div className="home-section__header">
        <h2 className="home-section__title">Artistas</h2>
      </div>

      <Row gutter={[16, 16]}>
        {artistas.map(artista => (
          <Col key={artista._id} xs={12} sm={8} md={6} lg={4}>
            <Link to={`/artistas/${artista._id}`} style={{ textDecoration: 'none' }}>
                <ArtistCard artista={artista} />
          </Link>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default ArtistasDestacados;