// models/Juego.js
const mongoose = require('mongoose');

const JuegoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  coverImage: {
    type: String, // URL de la portada
    required: true,
  },
  status: {
    type: String,
    enum: ['Jugando', 'Completado', 'Pendiente', 'Abandonado'],
    default: 'Pendiente',
  },
  rating: {
    type: Number, // Puntuación con estrellas (ej. 1 a 5)
    min: 0,
    max: 5,
    default: 0,
  },
  hoursPlayed: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  numOwners: {
  type: Number,
  default: 0,
  },
}, {
  timestamps: true, // Añade automáticamente createdAt y updatedAt
  collection: 'games'
});

module.exports = mongoose.model('Juego', JuegoSchema);