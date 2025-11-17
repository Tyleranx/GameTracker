// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Obtener el token del header
  const token = req.header('x-auth-token'); // O 'Authorization': 'Bearer <token>'

  // 2. Si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, permiso denegado' });
  }

  // 3. Verificar el token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Añade el payload del user (con el id) al request
    next(); // Pasa al siguiente middleware o ruta
  } catch (err) {
    res.status(401).json({ msg: 'El token no es válido' });
  }
};