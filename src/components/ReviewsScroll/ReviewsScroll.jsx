import React from 'react';
import ReviewCard from '../cards/ReviewCard';
import './ReviewsScroll.css';

const ReviewsScroll = ({ reviews, title = "Reseñas destacadas" }) => {
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  if (reviewsList.length === 0) return <p>No hay reseñas en el array</p>;

  return (
    <div className="reviews-scroll-container">
      <h3 className="scroll-title">{title}</h3>
      <div className="scroll-track">
        {reviews.map((review) => (
          <div key={review._id} className="scroll-item">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsScroll;