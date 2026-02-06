import React from 'react';
import { Star } from 'lucide-react'; // Cambiamos a lucide-react para mantener consistencia
import './ReviewCard.css'; // Corregimos el nombre del archivo CSS
const ReviewCard = ({ review }) => {
    return (
        <div key={review._id} className="review-card">
            <div className="review-header">
                <div className="reviewer-info">
                    <img
                        src={review.autor.url_profile_photo || `https://ui-avatars.com/api/?name=${review.autor.username}&background=random`}
                        className="reviewer-avatar"
                        alt="avatar"
                    />
                    <span className="reviewer-name">{review.autor.username}</span>
                </div>
                <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'star-filled' : 'text-gray-600'} />
                    ))}
                </div>
            </div>
            <p className="review-text">"{review.text}"</p>
        </div>
    );
}

export default ReviewCard;