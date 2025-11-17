// src/components/GameShowcase/GameShowcase.jsx
import React from 'react';
import GameCategorySlider from '../GameCategorySlider/GameCategorySlider'; // Importa el slider
import './GameShowcase.css'; // Mantenemos el CSS base del layout

const GameShowcase = () => {
  return (
    <section className="showcase-container">
      {/* Usamos el slider para la categoría RPG */}
      <GameCategorySlider category="rpg" isReverse={false} />

      {/* Usamos el slider para la categoría Indie */}
      <GameCategorySlider category="indie" isReverse={true} />
    </section>
  );
};

export default GameShowcase;