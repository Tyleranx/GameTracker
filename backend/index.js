// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos <-- Llamar a la función
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API de GameTracker funcionando!');
});

// Ruta autenticacion
app.use('/api/auth', require('./routes/auth'));

app.use('/api/juegos', require('./routes/games'));

app.use('/api/reviews', require('./routes/reviews'));

app.use('/api/library', require('./routes/library'));

app.use('/api/search', require('./routes/search'));

app.use('/api/stats', require('./routes/stats'));

// Iniciar el servidor
const PORT = process.env.PORT || 5001; // <-- Usar el puerto del .env
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});