import Login from './pages/Login';
import { Row, Col } from 'antd';
// iMPORTAR Datos de prueba para los álbumes
import { MOCK_ALBUMS, MOCK_ARTISTAS, MOCK_CANCIONES } from './utils/mockData';
import AlbumCard from './components/AlbumCard';
import ArtistCard from './components/ArtistCard';
import TrackCard from './components/TrackCard';

function Test() {
  return (
      <div>
        {/* Solo renderizamos el Login para verlo y editarlo */}
        <Row gutter={[16, 16]}>
          {MOCK_ALBUMS.map(album => (
          <Col key={album._id} span={6}>
            <AlbumCard album={album} />
          </Col>
        ))}
        </Row>

        <Row gutter={[16, 16]}>
          {MOCK_ARTISTAS.map(artista => (
          <Col key={artista._id} span={6}>
            <ArtistCard artista={artista} />
          </Col>
        ))}
        </Row>

        <Row gutter={[16, 16]}>
          {MOCK_CANCIONES.map(cancion => (
          <Col key={cancion._id} span={6}>
            <TrackCard cancion={cancion} />
          </Col>
        ))}
        </Row>
    </div>
  );
}

export default Test;