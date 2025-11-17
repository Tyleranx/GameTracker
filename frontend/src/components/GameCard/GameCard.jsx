// src/components/GameCard/GameCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating'; // Importa el rating
import './GameCard.css'; // Crea este CSS

const GameCard = ({ game, isReverse = false }) => {
  if (!game) return null; // Para evitar errores si el juego no carga

  const renderContent = () => (
    <>
      <div className="game-card-info">
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-description">{game.description}</p>
        <div className="game-card-buttons">
          {/* El link a la página de detalles del juego */}
          <Link to={`/juego/${game.slug}`} className="btn btn-dark">
            RESEÑA
          </Link>
          <div className="game-card-avg-rating">
            <StarRating rating={game.averageRating} />
            <span className="rating-text">{game.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      {/* La imagen también es un link */}
      <Link to={`/juego/${game.slug}`} className="game-card-image-container">
        <img src={game.coverImage} alt={game.title} className="game-card-image" />
      </Link>
    </>
  );

  return (
    <div className={`game-card-container ${isReverse ? 'reverse' : ''}`}>
      {renderContent()}
    </div>
  );
};

export default GameCard;