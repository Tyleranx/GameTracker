// models/Review.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  text: {
    type: String,
    required: [true, 'El texto de la reseña es obligatorio'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'La puntuación es obligatoria'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Juego',
    required: true,
  },
}, {
  timestamps: true, // Crea createdAt y updatedAt
});

module.exports = mongoose.model('Review', ReviewSchema);