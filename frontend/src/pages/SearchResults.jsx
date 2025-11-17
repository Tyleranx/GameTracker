// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SmallGameCard from '../components/SmallGameCard/SmallGameCard'; // Reutilizamos
import './SearchResults.css'; // Crearemos este CSS abajo

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Obtiene ?q=... de la URL
  
  const [results, setResults] = useState({ games: [], reviews: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <div className="search-msg">Buscando...</div>;
  if (!results.games.length && !results.reviews.length) 
    return <div className="search-msg">No se encontraron resultados para "{query}"</div>;

  return (
    <div className="search-results-container">
      <h2>Resultados para: "{query}"</h2>

      {/* Sección Juegos */}
      {results.games.length > 0 && (
        <section className="results-section">
          <h3>Juegos Encontrados</h3>
          <div className="results-grid">
            {results.games.map(game => (
              <SmallGameCard key={game._id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Sección Reseñas */}
      {results.reviews.length > 0 && (
        <section className="results-section">
          <h3>Reseñas que mencionan "{query}"</h3>
          <div className="reviews-list">
            {results.reviews.map(review => (
              <div key={review._id} className="search-review-item">
                <Link to={`/juego/${review.game?.slug}`} className="review-game-link">
                   En: <strong>{review.game?.title}</strong>
                </Link>
                <p>"{review.text}"</p>
                <span>- por {review.user?.username}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;