import React from 'react';
import { useParams } from 'react-router-dom';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TopFiveSection from '../components/TopFiveSection/TopFiveSection';
import useFetch from '../hooks/useFetch';
import './Detail.css';

const Profile = () => {
  const { id } = useParams();

  // Si no viene ID por URL, intentamos leerlo del usuario logueado en localStorage
  const loggedUser   = JSON.parse(localStorage.getItem('user') || 'null');
  const loggedUserId = loggedUser?._id || loggedUser?.id;
  const targetId     = id || loggedUserId;

  const { data: usuario, loading, error } = useFetch(
    targetId ? `/usuarios/${targetId}` : null,
    [targetId]
  );

  const coverImage = usuario?.url_profile_photo
    || `https://placehold.co/400x400/222/fff?text=${usuario?.username || 'Usuario'}`;

  if (!targetId) return <div className="loading-screen" style={{ color: '#ef4444' }}>No se especificó un usuario y no estás logueado.</div>;
  if (loading)   return <div className="loading-screen">Cargando...</div>;
  if (error)     return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;
  if (!usuario)  return null;

  return (
    <div className="detail-container">
      <div className="d-main-content">

        <EntityHeader
          type="User"
          title={usuario.username}
          image={coverImage}
          variant="circle"
        />

        <div className="d-section">
          <h2>Biografía</h2>
          <p>{usuario.bio || 'Este usuario no ha escrito una biografía todavía.'}</p>
        </div>

        <TopFiveSection
          title="Mis Álbumes"
          items={usuario.lists?.favoriteAlbums?.items || []}
          type="album"
          isOwner={true}
          onEdit={() => console.log('Editando álbumes...')}
        />

        <TopFiveSection
          title="Mis Canciones"
          items={usuario.lists?.favoriteSongs?.items || []}
          type="song"
          isOwner={true}
          onEdit={() => console.log('Editando canciones...')}
        />

      </div>
    </div>
  );
};

export default Profile;