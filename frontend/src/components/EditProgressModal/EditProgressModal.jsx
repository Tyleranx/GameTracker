// src/components/EditProgressModal/EditProgressModal.jsx
import React, { useState, useEffect } from 'react';
import './EditProgressModal.css';

const EditProgressModal = ({ userGame, onClose, onSave }) => {
  const [status, setStatus] = useState(userGame.status);
  const [progress, setProgress] = useState(userGame.progress);
  const [hoursPlayed, setHoursPlayed] = useState(userGame.hoursPlayed || 0);

  // Sincronizar el progreso si el estado cambia
  useEffect(() => {
    if (status === 'Completado') {
      setProgress(100);
    } else if (status === 'Pendiente' || status === 'Abandonado') {
      setProgress(0);
    }
  }, [status]);


  const handleSave = () => {
    onSave({
      status,
      progress: Number(progress),
      hoursPlayed: Number(hoursPlayed)
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Actualizar "{userGame.game.title}"</h2>
        
        <div className="form-group">
          <label htmlFor="status">Estado del juego</label>
          <select 
            id="status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Jugando">Jugando</option>
            <option value="Completado">Completado</option>
            <option value="Abandonado">Abandonado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="progress">Progreso: {progress}%</label>
          <input
            type="range"
            id="progress"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            disabled={status === 'Completado' || status === 'Pendiente' || status === 'Abandonado'}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hoursPlayed">Horas Jugadas</label>
          <input
            type="number"
            id="hoursPlayed"
            min="0"
            value={hoursPlayed}
            onChange={(e) => setHoursPlayed(e.target.value)}
            className="hours-input"
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-cancel">Cancelar</button>
          <button onClick={handleSave} className="btn btn-save">Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
};

export default EditProgressModal;