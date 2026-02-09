import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EntityHeader from '../components/EntityHeader/EntityHeader';
import TopFiveSection from '../components/TopFiveSection/TopFiveSection';

const API_URL = 'https://jukebox-rpt0.onrender.com';

// Importamos el CSS
import './Detail.css';

const Profile = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                // 1. Obtener el string del localStorage
                const userStorage = localStorage.getItem('user');

                // 2. Convertirlo de texto a objeto y sacar el ID
                let loggedInUserId = null;
                if (userStorage) {
                    const parsedUser = JSON.parse(userStorage);
                    loggedInUserId = parsedUser.id;
                }
                // SI no hay id en la URL, usamos el del usuario logueado
                const targetId = id || loggedInUserId;

                if (!targetId) {
                    setError("No se especificó un usuario y no estás logueado.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_URL}/usuarios/${targetId}`);

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.msg || 'Error al cargar el usuario');
                }

                const data = await response.json();

                setUsuario(data.data || data);

            } catch (err) {
                console.error("Error fetching user:", err);
                setError('Usuario no encontrado o error de conexión');
            } finally {
                setLoading(false);
            }
        };
        fetchUsuario();
    }, [id]);

    if (loading) return <div className="loading-screen">Cargando...</div>;
    if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;

    // Datos procesados con fallbacks seguros
    const coverImage = usuario?.url_profile_photo || `https://placehold.co/400x400/222/fff?text=${usuario?.username || 'Usuario'}`;

    return (
        <div className="detail-container">

            <div className="d-main-content">

                {/* 1. HEADER SUPERIOR (Portada y Título) */}
                <EntityHeader
                    type="User"
                    title={usuario.username}
                    image={coverImage}
                    variant="circle"
                />
                {/* 2. BIOGRAFÍA */}
                <div className="d-section">
                    <h2>Biografía</h2>
                    <p>{usuario.bio || "Este usuario no ha escrito una biografía."}</p>
                </div>
                {/* 3. LISTAS */}
                <TopFiveSection
                    title="Mis Álbumes"
                    items={usuario.lists?.favoriteAlbums.items || []}
                    type="album"
                    isOwner={true}
                    onEdit={() => openModal('album')}
                />

                <TopFiveSection
                    title="Mis Canciones"
                    items={usuario.lists?.favoriteSongs.items || []}
                    type="song"
                    isOwner={true}
                    onEdit={() => openModal('song')}
                />

            </div>
        </div>
    );
};

export default Profile;