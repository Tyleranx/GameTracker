// models/UserGame.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserGameSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Juego', // Asumiendo que tu modelo de juego se llama 'Juego'
    required: true,
  },
  status: { // Estado del juego: "Jugando", "Pendiente", "Completado", "Abandonado"
    type: String,
    enum: ['Jugando', 'Pendiente', 'Completado', 'Abandonado'],
    default: 'Pendiente',
  },
  progress: { // Porcentaje de avance (0-100)
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  hoursPlayed: {
    type: Number,
    default: 0,
    min: 0,
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
  // Podrías añadir más campos como hoursPlayed, lastPlayedDate, notes, etc.
});

// Aseguramos que un usuario solo pueda tener un juego una vez
UserGameSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('UserGame', UserGameSchema);