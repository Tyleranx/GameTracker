// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // <-- 1. IMPORTANTE: Añadir esto
const auth = require('../middleware/auth');
const UserGame = require('../models/UserGame');
const Review = require('../models/Review');

// @route   GET /api/stats
// @desc    Obtener estadísticas del usuario
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Total de juegos en biblioteca (Esto ya funcionaba bien)
    const totalGames = await UserGame.countDocuments({ user: userId });

    // 2. Distribución por Estado (CORREGIDO)
    const statusStats = await UserGame.aggregate([
      { 
        $match: { 
          // Convertimos el String ID a ObjectId para que la agregación funcione
          user: new mongoose.Types.ObjectId(userId) 
        } 
      },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Inicializamos en 0
    const statusDistribution = {
      Jugando: 0,
      Pendiente: 0,
      Completado: 0,
      Abandonado: 0
    };
    
    // Llenamos con los datos reales
    statusStats.forEach(stat => {
      // Aseguramos que el estado exista en nuestro objeto antes de asignar
      if (statusDistribution.hasOwnProperty(stat._id)) {
        statusDistribution[stat._id] = stat.count;
      }
    });

    // 3. Reseñas por mes (CORREGIDO)
    const reviewsStats = await Review.aggregate([
      { 
        $match: { 
          // Convertimos el String ID a ObjectId aquí también
          user: new mongoose.Types.ObjectId(userId)
        } 
      },
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" }, 
            year: { $year: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Total de reseñas (Esto ya funcionaba bien)
    const totalReviews = await Review.countDocuments({ user: userId });

    res.json({
      totalGames,
      totalReviews,
      statusDistribution,
      reviewsHistory: reviewsStats
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;