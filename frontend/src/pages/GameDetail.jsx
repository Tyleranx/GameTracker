// src/pages/GameDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating/StarRating';
import ReviewSection from '../components/ReviewSection/ReviewSection';
import { useAuth } from '../hooks/useAuth'; // Necesitamos el token del usuario
import './GameDetail.css';
import Swal from 'sweetalert2';

const GameDetail = () => {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInLibrary, setIsInLibrary] = useState(false); // Nuevo estado
  const { isAuthenticated, token } = useAuth(); // Obtenemos el token

  const reviewSectionRef = useRef(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/juegos/${slug}`);
        if (!res.ok) {
          throw new Error('Juego no encontrado');
        }
        const data = await res.json();
        setGame(data);
        setError(null);

        // 1. Verificar si el juego ya está en la biblioteca del usuario (si está logueado)
        if (isAuthenticated && token) {
          const libraryRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/library`, {
            headers: {
              'x-auth-token': token,
            },
          });
          if (libraryRes.ok) {
            const libraryData = await libraryRes.json();
            setIsInLibrary(libraryData.some(item => item.game && item.game._id === data._id));
          }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [slug, isAuthenticated, token]); // Añadimos isAuthenticated y token como dependencias

  const handleScrollToReviews = () => {
    reviewSectionRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // 2. Función para agregar a la biblioteca
  const handleAddToLibrary = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes iniciar sesión para agregar a tu biblioteca.',
        footer: '<a href="/login">Ir a Iniciar Sesión</a>'
      });
      return;
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/library`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ gameId: game._id }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Error al agregar a la biblioteca.');
      }
      
      setIsInLibrary(true);
      Swal.fire(
        '¡Agregado!',
        'El juego se ha añadido a tu biblioteca.',
        'success'
      );
      
    } catch (err) {
      console.error('Error al agregar a biblioteca:', err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
      });
    }
  };

  if (loading) return <div className="game-detail-message">Cargando...</div>;
  if (error) return <div className="game-detail-message error">{error}</div>;
  if (!game) return <div className="game-detail-message">Juego no encontrado.</div>;

  return (
    <div className="game-detail-container">
      <div className="game-detail-header">
        <Link to="/" className="back-link">&larr; Volver al inicio</Link>
        <h1 className="game-detail-title">{game.title}</h1>
        <p className="game-detail-genre">{game.genre}</p>
      </div>

      <div className="game-detail-content">
        <div className="game-detail-image-box">
          <img src={game.coverImage} alt={game.title} className="game-detail-image" />
        </div>
        <div className="game-detail-info">
          <p className="game-detail-description">{game.fullDescription}</p>
          <div className="game-detail-meta">
            <span>Desarrollador: <strong>{game.developer}</strong></span>
            <span>
              Puntuación ({game.numReviews} reseñas):
              <StarRating rating={game.averageRating} /> {game.averageRating.toFixed(1)}
            </span>
            {game.numOwners > 0 && <span>En bibliotecas de: <strong>{game.numOwners}</strong> usuarios</span>}
          </div>

          <div className="game-detail-buttons">
            {isAuthenticated ? ( // Solo muestra el botón si está logueado
                isInLibrary ? (
                    <Link to="/biblioteca" className="add-to-library-btn disabled">
                        En mi biblioteca
                    </Link>
                ) : (
                    <button 
                        onClick={handleAddToLibrary} 
                        className="add-to-library-btn"
                    >
                        Agregar a mi biblioteca
                    </button>
                )
            ) : ( // Si no está logueado, un enlace al login
                <Link to="/login" className="add-to-library-btn">
                    Inicia sesión para agregar
                </Link>
            )}

            <button 
              onClick={handleScrollToReviews} 
              className="review-btn"
            >
              Escribir reseña
            </button>
          </div>
        </div>
      </div>

      <div ref={reviewSectionRef} className="review-section-wrapper">
        <ReviewSection gameId={game._id} />
      </div>
    </div>
  );
};

export default GameDetail;