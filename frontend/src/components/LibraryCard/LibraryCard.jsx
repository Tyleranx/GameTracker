import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegTrashAlt, FaPen } from 'react-icons/fa'; // Iconos de borrar y editar
import './LibraryCard.css';

const LibraryCard = ({ 
  userGame, 
  selectionMode, 
  isSelected, 
  onToggleSelection, 
  onDelete,
  onEdit 
}) => {
  // Si el juego no está poblado, no renderizar (manejo de errores)
  if (!userGame || !userGame.game) return null; 

  const { game, status, progress, hoursPlayed } = userGame;

  const progressColor = 
    status === 'Completado' ? '#28a745' : // Verde
    status === 'Jugando' ? '#007bff' :   // Azul
    status === 'Abandonado' ? '#dc3545' : // Rojo
    '#6c757d'; // Gris para Pendiente

  return (
    <div className={`library-card-container ${isSelected ? 'selected' : ''}`}>
      {selectionMode && (
        <div 
          className="selection-checkbox" 
          onClick={() => onToggleSelection(userGame._id)}
        >
          <input type="checkbox" checked={isSelected} readOnly />
        </div>
      )}

      <Link to={`/juego/${game.slug}`} className="library-card-image-link">
        <img src={game.coverImage} alt={game.title} className="library-card-image" />
      </Link>

      <div className="library-card-info">
        <h3 className="library-card-title">{game.title}</h3>
        <p className="library-card-status" style={{ color: progressColor }}>
          {status}
        </p>
        {status !== 'Completado' && status !== 'Pendiente' && (
          <div className="library-card-progress">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%`, backgroundColor: progressColor }}
              ></div>
            </div>
            <span>{progress}%</span>
          </div>

        )}
        {/* Si está completado, simplemente el texto */}
        {status === 'Completado' && <span className="completed-text">100% Completado</span>}

        <p className="library-card-hours">
            {hoursPlayed === 0 ? 'No hay horas registradas' : `${hoursPlayed} ${hoursPlayed === 1 ? 'hora jugada' : 'horas jugadas'}`}
        </p>
      </div>

      <div className="library-card-actions">
        <button 
          onClick={() => onEdit(userGame)} 
          className="btn-action edit-btn"
          title="Editar progreso"
        >
          <FaPen />
        </button>
        <button 
          onClick={() => onDelete(userGame._id)} 
          className="btn-action delete-btn"
          title="Eliminar de biblioteca"
          disabled={selectionMode}
        >
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default LibraryCard;