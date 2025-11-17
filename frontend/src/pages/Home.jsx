// src/pages/Home.jsx
import React from 'react';
import HeroCarousel from '../components/HeroCarousel/HeroCarousel';
import GameShowcase from '../components/GameShowcase/GameShowcase'; 
import PopularGames from '../components/PopularGames/PopularGames';


const Home = () => {
  return (
    <main className="home-page">
      <HeroCarousel />
      <GameShowcase />
      <PopularGames />
    </main>
  );
};

export default Home;