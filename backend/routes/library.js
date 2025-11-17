// routes/library.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware de autenticación
const UserGame = require('../models/UserGame');
const Juego = require('../models/Game'); // Para actualizar numOwners

// @route   GET /api/library
// @desc    Obtener los juegos de la biblioteca del usuario logueado
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userGames = await UserGame.find({ user: req.user.id })
      .populate('game', ['title', 'coverImage', 'slug', 'genre']) // Trae info del juego
      .sort({ addedDate: -1 }); // Los más recientes primero
    res.json(userGames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST /api/library
// @desc    Agregar un juego a la biblioteca del usuario
// @access  Private
router.post('/', auth, async (req, res) => {
  const { gameId, status, progress } = req.body; // gameId será el _id del juego

  try {
    // Verificar si el juego ya está en la biblioteca del usuario
    let userGame = await UserGame.findOne({ user: req.user.id, game: gameId });

    if (userGame) {
      return res.status(400).json({ msg: 'Este juego ya está en tu biblioteca' });
    }

    // Crear una nueva entrada en la biblioteca
    userGame = new UserGame({
      user: req.user.id,
      game: gameId,
      status: status || 'Pendiente',
      progress: progress || 0,
    });

    await userGame.save();

    // Actualizar el contador de propietarios del juego
    await Juego.findByIdAndUpdate(gameId, { $inc: { numOwners: 1 } });

    // Devolver la entrada de la biblioteca con info del juego
    const populatedUserGame = await UserGame.findById(userGame._id)
                                            .populate('game', ['title', 'coverImage', 'slug', 'genre']);

    res.status(201).json(populatedUserGame);

  } catch (err) {
    console.error(err.message);
    // Si el error es una violación de índice único (lo que hace que no se pueda agregar dos veces)
    if (err.code === 11000) {
        return res.status(400).json({ msg: 'Este juego ya está en tu biblioteca' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT /api/library/:id
// @desc    Actualizar el estado/progreso de un juego en la biblioteca
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { status, progress, hoursPlayed } = req.body;

  try {
    let userGame = await UserGame.findById(req.params.id);

    if (!userGame) {
      return res.status(404).json({ msg: 'Juego no encontrado en la biblioteca' });
    }

    // Asegurarse de que el usuario es el propietario de la entrada
    if (userGame.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // Actualizar campos
    if (status) userGame.status = status;
    if (progress !== undefined) userGame.progress = progress; // Puede ser 0
    if (hoursPlayed !== undefined) userGame.hoursPlayed = hoursPlayed;

    await userGame.save();

    // Devolver la entrada actualizada con info del juego
    const populatedUserGame = await UserGame.findById(userGame._id)
                                            .populate('game', ['title', 'coverImage', 'slug', 'genre']);

    res.json(populatedUserGame);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE /api/library/:id
// @desc    Eliminar un juego de la biblioteca
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let userGame = await UserGame.findById(req.params.id);

    if (!userGame) {
      return res.status(404).json({ msg: 'Juego no encontrado en la biblioteca' });
    }

    if (userGame.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    await userGame.deleteOne(); // Usar deleteOne para mongoose 6+

    // Actualizar el contador de propietarios del juego
    await Juego.findByIdAndUpdate(userGame.game, { $inc: { numOwners: -1 } });

    res.json({ msg: 'Juego eliminado de la biblioteca' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE /api/library
// @desc    Eliminar múltiples juegos de la biblioteca
// @access  Private
router.delete('/', auth, async (req, res) => {
  const { ids } = req.body; // Espera un array de IDs de UserGame

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ msg: 'Se requiere un array de IDs para eliminar' });
  }

  try {
    // Encuentra y elimina todos los UserGame que pertenecen al usuario y están en la lista de IDs
    const deletedGames = await UserGame.find({ user: req.user.id, _id: { $in: ids } });

    if (deletedGames.length === 0) {
        return res.status(404).json({ msg: 'No se encontraron juegos para eliminar con los IDs proporcionados o no te pertenecen.' });
    }

    // Actualizar el contador de propietarios para cada juego eliminado
    for (const gameEntry of deletedGames) {
        await Juego.findByIdAndUpdate(gameEntry.game, { $inc: { numOwners: -1 } });
    }

    await UserGame.deleteMany({ user: req.user.id, _id: { $in: ids } });

    res.json({ msg: `${deletedGames.length} juegos eliminados de la biblioteca` });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});




module.exports = router;