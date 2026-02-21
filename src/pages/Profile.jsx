import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TopFiveSection from '../components/TopFiveSection/TopFiveSection';
import useFetch from '../hooks/useFetch';
import { deleteUser } from '../services/DeleteUserService';
import { useNavigate } from 'react-router-dom';

import './Detail.css';

const Profile = () => {
  const { id } = useParams();
  const { user: loggedUser } = useAuth();
  // Si no viene ID por URL, intentamos leerlo del usuario logueado en localStorage
  const loggedUserId = loggedUser?._id || loggedUser?.id;
  const targetId     = id || loggedUserId;
  const navigate = useNavigate();

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

  // VARIABLES PARA FUNCIONES DE ADMIN
  const isAdmin = loggedUser?.rol === 'admin';
  const isOwnProfile = String(loggedUser?._id || loggedUser?.id) === String(targetId);

  // Mostrar el botón solo si sos admin Y estás viendo el perfil de OTRO
  const canDelete = isAdmin && !isOwnProfile;
  //Funcion que se ejecuta al hacer click en el boton de eliminar usuario. Pide confirmacion y luego llama a la API para eliminarlo. Si es exitoso, redirige al home.
  
  const handleDeleteUser = () => {
  if (!window.confirm(`¿Seguro que querés eliminar la cuenta de ${usuario.username}?`)) return;
    deleteUser(targetId, { onSuccess: () => navigate('/') });
  };

  return (
    <div className="detail-container">
      <div className="d-main-content">
        {canDelete && (
          <button className="btn-danger" onClick={handleDeleteUser} style={{ marginLeft: 'auto', display: 'block' }}>
            🗑️ Eliminar cuenta
          </button>
        )}
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