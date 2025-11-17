// src/pages/Comunidad.jsx
import React from 'react';
import LatestReviews from '../components/LatestReviews/LatestReviews';
import GameGridByCategory from '../components/GameGridByCategory/GameGridByCategory';

const Comunidad = () => {
  return (
    <div className="comunidad-page-container">
      <LatestReviews />
      <GameGridByCategory />
    </div>
  );
};

export default Comunidad;