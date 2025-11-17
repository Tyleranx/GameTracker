// routes/juegos.js
const express = require('express');
const router = express.Router();
const Juego = require('../models/Game'); 

// @route   GET /api/juegos/destacados/:categoria
// @desc    Obtener juegos destacados por categoría (RPG, Indie, etc.)
// @access  Public
router.get('/destacados/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    
    // Hacemos una búsqueda real en la BD, filtrando por género
    // $options: 'i' hace que 'rpg' y 'RPG' sean lo mismo
    const juegosDestacados = await Juego.find({ 
      genre: { $regex: new RegExp('^' + categoria + '$', 'i') } 
    }).limit(4); // Límite de 4 juegos

    res.json(juegosDestacados);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/juegos/:slug
// @desc    Obtener detalles de un juego específico por su slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Buscamos un juego en la BD cuyo slug coincida
    const game = await Juego.findOne({ slug: slug });

    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ msg: 'Juego no encontrado' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/juegos
// @desc    Obtener TODOS los juegos
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Simplemente busca todos los juegos
    const juegos = await Juego.find().sort({ title: 1 }); // Ordenados alfabéticamente
    res.json(juegos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;