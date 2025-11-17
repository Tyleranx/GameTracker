// src/components/PopularGames/PopularGames.jsx
import React from 'react';
import './PopularGames.css';

// Importa las imágenes (recuerda subir dos niveles ../../)
import blackDesertImg from '../../assets/black-desert.jpg';
import marioKartImg from '../../assets/mario-kart.jpg';
import fc25Img from '../../assets/fc-25.jpg';

const PopularGames = () => {
  return (
    <section className="popular-games-container">
      <h2 className="popular-title">Juegos populares</h2>
      
      <div className="popular-grid">
        
        {/* --- Columna Izquierda (Tarjeta Grande) --- */}
        <div className="game-card large-card">
          <div className="card-image-container">
            <img src={blackDesertImg} alt="Black Desert" />
          </div>
          <div className="card-info">
            <h3>BLACK DESERT</h3>
            <p>DESCRIPCIÓN</p>
            <span>Black Desert es un MMORPG de fantasía de mundo abierto conocido por sus impresionantes gráficos, un creador de personajes muy detallado y un sistema de combate de acción dinámico basado en combos.</span>
          </div>
        </div>

        {/* --- Columna Derecha (Tarjetas Pequeñas) --- */}
        <div className="small-column">
          
          <div className="game-card small-card">
            <div className="card-image-container">
              <img src={marioKartImg} alt="Mario Kart" />
            </div>
            {/* texto para mario kart */}
            {/* <div className="card-info">
              <h3>Mario Kart 8</h3>
            </div> */}
          </div>

          <div className="game-card small-card">
            <div className="card-image-container">
              <img src={fc25Img} alt="FC 25" />
            </div>
            <div className="card-info">
              <h3>fifa 25</h3>
              <p>descripción</p>
              <span>EA Sports FC 25 redefine la estrategia en el campo con el nuevo sistema "FC IQ".</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PopularGames;