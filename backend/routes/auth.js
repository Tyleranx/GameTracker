// routes/auth.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // Importamos el validador
const bcrypt = require('bcryptjs'); // Importamos bcrypt
const jwt = require('jsonwebtoken'); // Importamos JWT
const User = require('../models/User'); // Importamos el modelo de Usuario
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post(
  '/register',
  [
    // --- Validación de entrada ---
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'Por favor, incluye un email válido').isEmail(),
    check('password', 'La contraseña debe tener 6 o más caracteres').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // 1. Revisar si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 2. Extraer datos del body
    const { username, email, password } = req.body;

    try {
      // 3. Revisar si el usuario (email) ya existe
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Este email ya está registrado' }] });
      }

      // 4. Si no existe, crear el nuevo usuario
      user = new User({
        username,
        email,
        password,
      });

      // 5. Hashear (encriptar) la contraseña ANTES de guardarla
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // 6. Guardar el usuario en la BD
      await user.save();

      // 7. Crear y devolver el Token (para que se loguee automáticamente)
      const payload = {
        user: {
          id: user.id, // Guardamos el ID del usuario en el token
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' }, // El token expira en 5 horas
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token }); // Devolvemos el token
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error del servidor');
    }
  }
);

// @route   POST /api/auth/login
// @desc    Autenticar (loguear) un usuario y obtener un token
// @access  Public
router.post(
  '/login',
  [
    // --- Validación de entrada ---
    check('email', 'Por favor, incluye un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
  ],
  async (req, res) => {
    // 1. Revisar si hay errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 2. Extraer datos del body
    const { email, password } = req.body;

    try {
      // 3. Revisar si el usuario (email) existe
      let user = await User.findOne({ email });

      if (!user) {
        // Si el email no existe
        return res
          .status(400)
          .json({ errors: [{ msg: 'Credenciales inválidas' }] });
      }

      // 4. Si el email existe, comparar las contraseñas
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        // Si la contraseña es incorrecta
        return res
          .status(400)
          .json({ errors: [{ msg: 'Credenciales inválidas' }] });
      }

      // 5. Si las credenciales son correctas, crear y devolver el Token
      const payload = {
        user: {
          id: user.id, // Guardamos el ID del usuario en el token
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' }, // El token expira en 5 horas
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // Devolvemos el token
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error del servidor');
    }
  }
);

// @route   GET /api/auth/me
// @desc    Obtener los datos del usuario logueado
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id viene del middleware 'auth'
    const user = await User.findById(req.user.id).select('-password'); // No devuelvas la contraseña
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
