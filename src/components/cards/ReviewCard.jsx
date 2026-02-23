import React, { useContext, useState } from 'react';
import { Star, Heart, Trash2 } from 'lucide-react';
import { message } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import './ReviewCard.css';

const ReviewCard = ({ review, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.rol === 'admin';
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta reseña?')) return;
    setDeleting(true);
    try {
      await api.delete(`/reviews/${review._id}`);
      message.success('Reseña eliminada');
      onDelete?.(review._id);
    } catch (err) {
      message.error(err.response?.data?.error || 'Error al eliminar');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <img
            src={review.autor.url_profile_photo || `https://ui-avatars.com/api/?name=${review.autor.username}&background=random`}
            className="reviewer-avatar"
            alt="avatar"
          />
          <span className="reviewer-name">{review.autor.username}</span>
        </div>
        <div className="reviewer-info">
          <Heart size={12} className={review.like ? 'heart-filled' : 'text-gray-600'} />
          <div className="review-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? 'star-filled' : 'text-gray-600'} />
            ))}
          </div>
          {isAdmin && (
            <button
              className="review-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Eliminar reseña (admin)"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
      <p className="review-text">"{review.comentario}"</p>
    </div>
  );
};

export default ReviewCard;