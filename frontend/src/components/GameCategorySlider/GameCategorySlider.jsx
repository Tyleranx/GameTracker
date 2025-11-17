// src/components/GameCategorySlider/GameCategorySlider.jsx
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules'; // Añadimos Navigation para flechas
import GameCard from '../GameCard/GameCard'; // Importamos la GameCard

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Estilos para las flechas
import './GameCategorySlider.css'; // Crea este CSS

const GameCategorySlider = ({ category, isReverse = false }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/juegos/destacados/${category}`);
        if (!res.ok) {
          throw new Error('No se pudieron cargar los juegos de la categoría.');
        }
        const data = await res.json();
        setGames(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar juegos:', err.message);
        setError('Error al cargar los juegos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [category]); // Vuelve a cargar si la categoría cambia

  if (loading) return <div className="loading-message">Cargando juegos de {category}...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (games.length === 0) return <div className="no-games-message">No hay juegos disponibles en {category}.</div>;


  return (
    <div className="game-category-slider-wrapper">
      <h2 className="slider-category-title">{category}</h2>
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        navigation={false} // Habilita las flechas de navegación
        className="myGameCategorySwiper"
      >
        {games.map((game) => (
          <SwiperSlide key={game._id}>
            <GameCard game={game} isReverse={isReverse} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameCategorySlider;