// backend/routes/search.js
const express = require('express');
const router = express.Router();
const Juego = require('../models/Game');
const Review = require('../models/Review');

// @route   GET /api/search?q=termino
// @desc    Buscar juegos y reseñas
// @access  Public
router.get('/', async (req, res) => {
  const { q } = req.query; // Obtenemos el término de búsqueda de la URL

  if (!q) {
    return res.status(400).json({ msg: 'Por favor ingresa un término de búsqueda' });
  }

  try {
    // 1. Buscar en Juegos (por título o género)
    // $regex con 'i' hace que no importen mayúsculas/minúsculas
    const games = await Juego.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);

    // 2. Buscar en Reseñas (por contenido del texto)
    const reviews = await Review.find({
      text: { $regex: q, $options: 'i' }
    })
    .populate('user', 'username') // Necesitamos saber quién escribió
    .populate('game', 'title slug coverImage') // Necesitamos saber de qué juego es
    .limit(10);

    res.json({ games, reviews });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;