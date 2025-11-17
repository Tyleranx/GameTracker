// src/components/StarRatingInput/StarRatingInput.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRatingInput.css';

const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="star-rating-input">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
            <FaStar
              className="star"
              color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
              size={30}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRatingInput;