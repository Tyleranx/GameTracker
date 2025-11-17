// routes/reviews.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importamos el middleware
const Review = require('../models/Review');
const Juego = require('../models/Game');
const User = require('../models/User');

// @route   GET /api/reviews/latest
// @desc    Obtener las 10 reseñas más recientes
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 }) // Ordena por fecha de creación descendente
      .limit(10) // Trae solo 10
      .populate('user', '_id username') // Info del usuario
      .populate('game', '_id title coverImage slug'); // Info del juego

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/reviews/:gameId
// @desc    Obtener todas las reseñas de un juego
// @access  Public
router.get('/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId })
      .populate('user', '_id username') // Trae el username del usuario
      .sort({ createdAt: -1 }); // Las más nuevas primero
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST /api/reviews/:gameId
// @desc    Crear una reseña para un juego
// @access  Private (¡protegida!)
router.post('/:gameId', auth, async (req, res) => {
  const { rating, text } = req.body;
  const gameId = req.params.gameId;
  const userId = req.user.id;

  try {
    // 1. Crear y guardar la nueva reseña
    const newReview = new Review({
      text,
      rating,
      user: userId,
      game: gameId,
    });
    await newReview.save();

    // --- 2. LÓGICA DE PUNTUACIÓN DINÁMICA ---
    // Buscar todas las reseñas de este juego
    const reviews = await Review.find({ game: gameId });

    // Calcular el nuevo promedio
    const newAvgRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    // Actualizar el juego con el nuevo promedio y número de reseñas
    await Juego.findByIdAndUpdate(gameId, {
      averageRating: newAvgRating.toFixed(1), // Redondea a 1 decimal
      numReviews: reviews.length,
    });

    // 3. Devolver la nueva reseña (con el user populado)
    const populatedReview = await Review.findById(newReview._id)
                                        .populate('user', '_id username');

    res.status(201).json(populatedReview);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT /api/reviews/:reviewId
// @desc    Actualizar una reseña
// @access  Private
router.put('/:reviewId', auth, async (req, res) => {
  const { rating, text } = req.body;
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    let review = await Review.findById(reviewId);

    // 1. Verificar si la reseña existe
    if (!review) {
      return res.status(404).json({ msg: 'Reseña no encontrada' });
    }

    // 2. Verificar si el usuario es el dueño de la reseña
    if (review.user.toString() !== userId) {
      return res.status(401).json({ msg: 'No autorizado para editar esta reseña' });
    }

    // 3. Actualizar la reseña
    if (rating) review.rating = rating;
    if (text) review.text = text;

    await review.save();

    // 4. Recalcular el promedio del juego (¡Importante!)
    const gameId = review.game;
    const reviews = await Review.find({ game: gameId });
    const newAvgRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Juego.findByIdAndUpdate(gameId, {
      averageRating: newAvgRating.toFixed(1),
      numReviews: reviews.length,
    });

    // 5. Devolver la reseña actualizada (con el user populado)
    const populatedReview = await Review.findById(reviewId)
                                        .populate('user', '_id username');
    
    res.json(populatedReview);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// --- ELIMINAR UNA RESEÑA (DELETE) ---

// @route   DELETE /api/reviews/:reviewId
// @desc    Eliminar una reseña
// @access  Private
router.delete('/:reviewId', auth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    let review = await Review.findById(reviewId);

    // 1. Verificar si la reseña existe
    if (!review) {
      return res.status(404).json({ msg: 'Reseña no encontrada' });
    }

    // 2. Verificar si el usuario es el dueño
    if (review.user.toString() !== userId) {
      return res.status(401).json({ msg: 'No autorizado para eliminar esta reseña' });
    }

    // 3. Guardar el ID del juego antes de borrar
    const gameId = review.game;

    // 4. Borrar la reseña
    await review.deleteOne();

    // 5. Recalcular el promedio del juego
    const reviews = await Review.find({ game: gameId });
    
    let newAvgRating = 0;
    let numReviews = 0;

    if (reviews.length > 0) {
      newAvgRating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      numReviews = reviews.length;
    }

    await Juego.findByIdAndUpdate(gameId, {
      averageRating: newAvgRating.toFixed(1),
      numReviews: numReviews,
    });
    
    res.json({ msg: 'Reseña eliminada' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});



module.exports = router;