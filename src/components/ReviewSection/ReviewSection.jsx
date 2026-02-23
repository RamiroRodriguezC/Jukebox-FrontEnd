import { useState, useContext } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCard from '../cards/ReviewCard';
import OwnReview from '../cards/OwnReview';
import { AuthContext } from '../../context/AuthContext';
import './ReviewSection.css';

const ReviewSection = ({ 
  rating, totalReviews, reviews: initialReviews, 
  emptyMessage = "Aún no hay reseñas.",
  entityId, entityName, entityType,
}) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState(initialReviews);

  const userId    = user?._id || user?.id;
  const ownReview = user ? reviews.find(r => r.autor?._id === userId) : null;
console.log('reviews del array:', reviews.map(r => ({ id: r._id, autor: r.autor?.username })));
console.log('ownReview._id:', ownReview?._id);
  const handleReviewChange = (action, review) => {
    if (action === 'create') setReviews(prev => [review, ...prev]);
    if (action === 'edit')   setReviews(prev => prev.map(r => r._id === review._id ? review : r));
    if (action === 'delete') setReviews(prev => prev.filter(r => r._id !== review._id));
  };

  return (
    <section className="reviews-section">

      <div className="rating-summary-card">
        <div className="big-rating">{rating.toFixed(1)}</div>
        <div className="stars-row">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} className={i < Math.round(rating) ? 'star-filled' : 'text-gray-600'} />
          ))}
        </div>
        <div className="total-reviews">Basado en {totalReviews} reseñas</div>
      </div>

      {user && (
        <OwnReview
          userId={userId}
          entityId={entityId}
          entityType={entityType}
          ownReview={ownReview}
          onReviewChange={handleReviewChange}
        />
      )}

      <div className="review-list">
        {reviews.filter(r => r._id !== ownReview?._id).length > 0 ? (
          reviews.filter(r => r._id !== ownReview?._id).map(review => (
            <ReviewCard key={review._id} review={review} onDelete={(id) => handleReviewChange('delete', { _id: id })} />
          ))
        ) : (
          !ownReview && <p className="empty-message">{emptyMessage}</p>
        )}
      </div>

      <Link to={`/reviews/${entityType}/${entityId}`} state={{ nombre: entityName, entityType }} className="btn-more-reviews">
        <button className="btn-see-more">Ver todas las reseñas</button>
      </Link>

    </section>
  );
};

export default ReviewSection;