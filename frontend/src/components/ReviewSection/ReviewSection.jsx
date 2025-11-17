// src/components/ReviewSection/ReviewSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Importa el hook
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importamos SweetAlert
import './ReviewSection.css';
import StarRatingInput from '../StarRatingInput/StarRatingInput';

const ReviewSection = ({ gameId }) => {
  // 1. Obtenemos el 'user' y el 'loading' del contexto
  const { isAuthenticated, token, user, loading: authLoading } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [formError, setFormError] = useState('');

  // 2. Nuevos estados para el "Modo Edición"
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // 3. Referencia para hacer scroll al formulario al editar
  const formRef = useRef(null);

  // Cargar reseñas existentes (sin cambios)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${gameId}`);
        const data = await res.json();
        setReviews(data);
        setError(null);
      } catch {
        setError('No se pudieron cargar las reseñas.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [gameId]);

  // 4. Función para "Cancelar Edición"
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReviewId(null);
    setText('');
    setRating(0);
    setFormError('');
  };

  // 5. Función para "Iniciar Edición"
  const handleStartEdit = (review) => {
    setIsEditing(true);
    setEditingReviewId(review._id);
    setText(review.text);
    setRating(review.rating);
    // Mueve la vista al formulario
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // 6. Función para "Eliminar Reseña"
  const handleDelete = (reviewId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, ¡eliminar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token },
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.msg || 'No se pudo eliminar');
          }

          // Actualiza el estado del frontend
          setReviews(reviews.filter(r => r._id !== reviewId));
          Swal.fire('¡Eliminada!', 'Tu reseña ha sido eliminada.', 'success');
        } catch (err) {
          Swal.fire('Error', err.message, 'error');
        }
      }
    });
  };

  // 7. El 'handleSubmit' maneja tanto CREAR como ACTUALIZAR
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || text.trim() === '') {
      setFormError('Por favor, añade una puntuación y un texto.');
      return;
    }
    setFormError('');

    const reviewData = { rating, text };

    try {
      let res;
      let data;

      if (isEditing) {
        // --- LÓGICA DE ACTUALIZACIÓN (PUT) ---
        res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${editingReviewId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(reviewData),
        });
        
        data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'No se pudo actualizar');

        // Actualiza la reseña en la lista del frontend
        setReviews(
          reviews.map(r => (r._id === editingReviewId ? data : r))
        );
        Swal.fire('¡Guardada!', 'Tu reseña ha sido actualizada.', 'success');
        handleCancelEdit(); // Resetea el formulario

      } else {
        // --- LÓGICA DE CREACIÓN (POST) ---
        res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${gameId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(reviewData),
        });

        data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'No se pudo enviar');

        // Añade la nueva reseña al inicio de la lista
        setReviews([data, ...reviews]);
        setText('');
        setRating(0);
      }
    } catch (err) {
      setFormError(err.message);
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="reviews-container">
      <h2>Reseñas y Puntuaciones</h2>
      
      {/* 8. Añadimos la 'ref' al formulario */}
      <div className="review-form-box" ref={formRef}>
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="review-form">
            {/* 9. Título y botones dinámicos */}
            <h3>{isEditing ? 'Editando tu reseña' : 'Escribe tu reseña'}</h3>
            {formError && <div className="form-error">{formError}</div>}
            
            <div className="form-group">
              <label>Tu Puntuación:</label>
              <StarRatingInput rating={rating} setRating={setRating} />
            </div>
            <div className="form-group">
              <label htmlFor="reviewText">Tu Reseña:</label>
              <textarea
                id="reviewText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="¿Qué te pareció el juego?"
                rows="5"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="review-submit-btn">
                {isEditing ? 'Guardar Cambios' : 'Enviar Reseña'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="review-cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="review-login-prompt">
            <Link to="/login">Inicia sesión</Link> para dejar tu reseña.
          </div>
        )}
      </div>

      <div className="review-list">
        <h3>Comentarios de la comunidad</h3>
        {loading || authLoading && <p>Cargando reseñas...</p>}
        {error && <p>{error}</p>}
        
        {!loading && reviews.length === 0 && (
          <p>Todavía no hay reseñas. ¡Sé el primero!</p>
        )}
        
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <span className="review-user">{review.user?.username || 'Usuario'}</span>
              <span className="review-rating">
                {Array(review.rating).fill('★').join('')}
                {Array(5 - review.rating).fill('☆').join('')}
              </span>
            </div>
            <p className="review-text">{review.text}</p>
            <div className="review-footer">
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              
              {/* 10. Lógica para mostrar botones de acción */}
              {!authLoading && user && user._id === review.user?._id && (
                <div className="review-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleStartEdit(review)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(review._id)}
                  >
                    Borrar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;