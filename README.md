# 🎮 GameTracker


**GameTracker** es una aplicación web Full-Stack diseñada para los amantes de los videojuegos. Permite a los usuarios gestionar su biblioteca personal, llevar un seguimiento de su progreso, ver estadísticas detalladas y compartir reseñas con la comunidad.

Construida con el stack **MERN** (MongoDB, Express, React, Node.js).

## ✨ Características Principales

* **📚 Gestión de Biblioteca:** Agrega juegos, actualiza tu estado (Jugando, Completado, Pendiente, Abandonado) y registra tu porcentaje de avance y horas jugadas.
* **📊 Dashboard Personal:** Visualiza tus estadísticas con gráficos interactivos (Chart.js): tasa de finalización, distribución de estados y actividad de reseñas.
* **🔍 Búsqueda Global:** Encuentra juegos y reseñas instantáneamente por título, género o autor.
* **⭐ Sistema de Reseñas:** Escribe, edita y elimina tus propias reseñas. Consulta la calificación promedio dinámica de cada juego.
* **🔐 Autenticación Segura:** Registro e inicio de sesión de usuarios utilizando JSON Web Tokens (JWT) y encriptación de contraseñas.
* **📱 Diseño Responsive:** Interfaz adaptada a móviles con menú de navegación dinámico.
* **🎨 UI Moderna:** Carruseles de imágenes (Swiper), alertas animadas (SweetAlert2) y diseño limpio.

## 🛠️ Tecnologías Utilizadas

### Frontend
* **React** (Vite)
* **React Router DOM** (Navegación)
* **Context API** (Manejo de estado global y Auth)
* **Chart.js & React-Chartjs-2** (Gráficos)
* **Swiper** (Carruseles)
* **SweetAlert2** (Notificaciones)
* **CSS3** (Estilos personalizados y responsivos)

### Backend
* **Node.js** (Entorno de ejecución)
* **Express** (Framework del servidor)
* **MongoDB Atlas** (Base de datos en la nube)
* **Mongoose** (ODM)
* **JWT** (Autenticación)
* **Bcryptjs** (Seguridad)

---

## 🚀 Guía de Instalación

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos
* Node.js (v14 o superior)
* NPM (viene con Node)
* Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o una instancia local de MongoDB).

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Kerinc1/GameTracker.git
cd gametracker
2. Configuración del Backend
Ve a la carpeta del servidor e instala las dependencias:

Bash

cd backend
npm install
Variables de Entorno: Crea un archivo llamado .env dentro de la carpeta backend/ y añade lo siguiente:

Fragmento de código

PORT=5001
MONGO_URI=tu_string_de_conexion_de_mongodb
JWT_SECRET=tu_palabra_secreta_super_segura
Nota: Reemplaza tu_string_de_conexion... con tu URI real de MongoDB Atlas.

Iniciar el Servidor:

Bash

npm index.js
El servidor debería correr en http://localhost:5001.

3. Configuración del Frontend
Abre una nueva terminal, ve a la carpeta del cliente e instala las dependencias:

Bash

cd frontend
npm install
Iniciar el Cliente:

Bash

npm run dev
La aplicación se abrirá en http://localhost:5173 (o el puerto que indique Vite).

📂 Estructura del Proyecto
gametracker/
├── backend/             # Servidor API (Node/Express)
│   ├── config/          # Conexión a BD
│   ├── middleware/      # Auth middleware
│   ├── models/          # Schemas de Mongoose (Game, User, Review, UserGame)
│   ├── routes/          # Endpoints de la API
│   └── index.js         # Punto de entrada
│
├── frontend/            # Cliente (React/Vite)
│   ├── public/          # Assets estáticos
│   └── src/
│       ├── components/  # Componentes reutilizables (Navbar, Cards, Modals)
│       ├── context/     # AuthContext
│       ├── hooks/       # Custom hooks (useAuth)
│       ├── pages/       # Vistas (Home, library, GameDetail, Stats)
│       └── App.jsx      # Rutas principales