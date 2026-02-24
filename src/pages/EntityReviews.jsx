import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReviewsScroll from '../components/ReviewsScroll/ReviewsScroll.jsx';
import api from '../api/api.js';
import './Detail.css'; // antes: './EntityReviews.css'

const EntityReviews = () => {
  const { id, entityType } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { nombre } = location.state || { nombre: "Cargando..." };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/${entityType}/${id}`);
        setReviews(response.data.docs || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        const msg = err.response?.data?.message || 'Reviews no encontradas o error de conexión';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id, entityType]);

  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (error)   return <div className="loading-screen" style={{ color: '#ef4444' }}>{error}</div>;

  return (
    <div className="detail-container">
      <div className="d-main-content">
        <div className="reviews-header">
          <h2>Reseñas de {nombre}</h2>
        </div>
        <ReviewsScroll
          reviews={reviews}
          setReviews={setReviews}
          title={`Explora las opiniones de ${nombre}`}
        />
      </div>
    </div>
  );
};

export default EntityReviews;