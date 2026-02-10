import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, Clock, User } from 'lucide-react';
import ReviewsScroll from '../../components/ReviewsScroll/ReviewsScroll';


const API_URL = 'https://jukebox-rpt0.onrender.com'; 


const EntityReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]); // Nuevo estado para las reseñas reales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Hook para recibir el state enviado por el Link
  // Extraemos los datos enviados por el Link
  const { nombre, entityType } = location.state || { nombre: "Cargando...", entityType: "Entidad" };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const type = entityType.toLowerCase();
        const response = await fetch(`${API_URL}/reviews/${type}/${id}`);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.msg || 'Error al cargar las reseñas del álbum');
        }

        const data = await response.json();
        setReviews(data.docs || []);

      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError('Reviews no encontradas o error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id,entityType]);

  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (error) return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;

  return (
    <div className="detail-container">
        {/* Header con ititulo del album */}
        <div > 
            <h2>Reseñas de {nombre}</h2>
        </div>
        {/* Seccion de reviews */}
        <ReviewsScroll
          reviews={reviews} 
          title={`Explora las opiniones de ${nombre}`} 
        />
    </div>
  );
};

export default EntityReviews;