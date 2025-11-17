import React, { useState, useEffect } from 'react';
import SmallGameCard from '../SmallGameCard/SmallGameCard';
import './GameGridByCategory.css';

const GameGridByCategory = () => {
  const [groupedGames, setGroupedGames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/juegos`);
        const data = await res.json();

        if (res.ok) {
          // Agrupa los juegos por género
          const groups = data.reduce((acc, game) => {
            const genre = game.genre || 'Otros';
            if (!acc[genre]) {
              acc[genre] = [];
            }
            acc[genre].push(game);
            return acc;
          }, {});
          setGroupedGames(groups);
        }
      } catch (err) {
        console.error('Error cargando todos los juegos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGames();
  }, []);

  if (loading) return <p>Cargando todos los juegos...</p>;
  if (Object.keys(groupedGames).length === 0) return null;

  return (
    <div className="game-grid-container">
      {Object.entries(groupedGames).map(([genre, games]) => (
        <section key={genre} className="category-section">
          <h2>Juegos {genre}</h2>
          <div className="category-grid">
            {games.map((game) => (
              <SmallGameCard key={game._id} game={game} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default GameGridByCategory;