import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TopFiveSection from '../components/TopFiveSection/TopFiveSection';
import api from '../api/api.js';

// Importamos el CSS
import './Detail.css';

const Profile = () => {
    // Obtenemos el ID desde la URL (si es que existe)
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            setLoading(true);
            try {
                // 1. Manoteamos el string del storage (el que guardamos cuando el loco hizo login)
                const userStorage = localStorage.getItem('user');

                // 2. Si hay algo, lo parseamos para sacar el ID
                let loggedInUserId = null;
                if (userStorage) {
                    const parsedUser = JSON.parse(userStorage);
                    // Chequeamos si es _id (Mongo) o id a secas para que no se nos escape nada
                    loggedInUserId = parsedUser._id || parsedUser.id;
                }
                
                // Si la URL no trae ID, usamos el del que está logueado ahora
                const targetId = id || loggedInUserId;

                if (!targetId) {
                    setError("No se especificó un usuario y no estás logueado.");
                    setLoading(false);
                    return;
                }

                // 3. Mandamos el GET con Axios (la URL base ya está en la instancia 'api')
                const response = await api.get(`/usuarios/${targetId}`);

                // 4. Axios ya nos deja la data servida en bandeja dentro de .data
                // Metemos este fallback por si el back devuelve el objeto envuelto o directo
                const userData = response.data.data || response.data;
                setUsuario(userData);

            } catch (err) {
                console.error("Se rompió algo buscando al user:", err);
                // Atajamos el mensaje que escupe el back para no mostrar cualquier fruta
                const msg = err.response?.data?.message || 'Usuario no encontrado o error de conexión';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuario();
    }, [id]);

    if (loading) return <div className="loading-screen">Cargando...</div>;
    if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;
    
    // Si llegamos acá, es porque somos unos cracks y tenemos el usuario
    if (!usuario) return null;

    // Foto de perfil o un placeholder para que no quede un hueco feo
    const coverImage = usuario?.url_profile_photo || `https://placehold.co/400x400/222/fff?text=${usuario?.username || 'Usuario'}`;

    return (
        <div className="detail-container">
            <div className="d-main-content">

                {/* 1. HEADER SUPERIOR (La cara del user y el nombre) */}
                <EntityHeader
                    type="User"
                    title={usuario.username}
                    image={coverImage}
                    variant="circle"
                />

                {/* 2. BIOGRAFÍA */}
                <div className="d-section">
                    <h2>Biografía</h2>
                    <p>{usuario.bio || "Este usuario no ha escrito una biografía todavía."}</p>
                </div>

                {/* 3. LISTAS (Acá clavamos optional chaining para que no explote si está vacío) */}
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