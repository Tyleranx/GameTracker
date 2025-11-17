import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import './SmallGameCard.css';

const SmallGameCard = ({ game }) => {
  return (
    <div className="small-game-card-container">
      <Link to={`/juego/${game.slug}`}>
        <img 
          src={game.coverImage} 
          alt={game.title} 
          className="small-game-card-image" 
        />
      </Link>
      <div className="small-game-card-info">
        <h3>{game.title}</h3>
        <div className="small-game-card-rating">
          <span>Puntuación:</span>
          <StarRating rating={game.averageRating} />
        </div>
      </div>
    </div>
  );
};

export default SmallGameCard;