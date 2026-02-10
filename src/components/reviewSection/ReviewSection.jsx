import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCard from '../cards/ReviewCard';
import './ReviewSection.css';

const ReviewSection = ({ 
  rating, 
  totalReviews, 
  reviews, 
  emptyMessage = "Aún no hay reseñas.",
  entityId,
  entityName,
  entityType // Puede ser 'album' o 'cancion' 
   }) => {
  return (
    <section className="reviews-section">

      {/* Bloque de Resumen de Rating */}
      <div className="rating-summary-card">
        <div className="big-rating">{rating.toFixed(1)}</div>
        <div className="stars-row">
          {/* Hacemos un array {0,1,2,3,4} y ejecutamos un map con la funcion definida a continuacion
          Por cada espacio del array "agregamos" una estrella, y si la posicion del array es menor que el redondeo del rating, llenamos de amarillo. */}
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < Math.round(rating) ? 'star-filled' : 'text-gray-600'}
            />
          ))}
        </div>
        <div className="total-reviews">Basado en {totalReviews} reseñas</div>
      </div>

      {/* Lista de Reviews */}
      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <p className="empty-message">{emptyMessage}</p>
        )}
      </div>
      <div>
        {/* Link para ver todas las reseñas, pasando el nombre de la canción por el state */}
        <Link
          to={`/reviews/${entityType}/${entityId}`}
          state={{
            nombre: entityName,
            entityType: entityType
            
          }}
          className="btn-more-reviews"
        >
          <button className="btn-see-more">Ver todas las reseñas</button>
        </Link>
      </div>
    </section>
  );
};

export default ReviewSection;