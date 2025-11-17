import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating'; // Reutilizamos el componente
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  // Manejo por si el juego o usuario fue borrado
  if (!review.game || !review.user) {
    return null;
  }

  return (
    <div className="review-card-container">
      <Link to={`/juego/${review.game.slug}`}>
        <img 
          src={review.game.coverImage} 
          alt={review.game.title} 
          className="review-card-image" 
        />
      </Link>
      <div className="review-card-info">
        <p>Reseñado por: <strong>{review.user.username}</strong></p>
        <div className="review-card-rating">
          <span>Calificación:</span>
          <StarRating rating={review.rating} />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;