// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true, // No puede haber dos usuarios con el mismo email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, introduce un email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6, // Mínimo 6 caracteres
  },
  // (Aquí podríamos añadir más, como 'avatar', etc. pero empecemos simple)
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);