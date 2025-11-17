// src/components/StarRating/StarRating.jsx
import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa'; // Importa iconos de estrellas
import './StarRating.css'; // Crea este CSS

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="star half" />);
    } else {
      stars.push(<FaRegStar key={i} className="star empty" />);
    }
  }
  return <div className="star-rating">{stars}</div>;
};

export default StarRating;