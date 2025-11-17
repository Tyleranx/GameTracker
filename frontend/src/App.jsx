// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 1. Importar Routes y Route
import Navbar from './components/Navbar/Navbar'; // Importamos el Navbar
import Home from './pages/Home'; // Importamos la página Home
import Login from './pages/Login';
import './index.css'; // Importamos los estilos globales
import Footer from './components/Footer/Footer';
import SignIn from './pages/SignIn';
import GameDetail from './pages/GameDetail';
import Library from './pages/Library';
import Community from './pages/Community';
import SearchResults from './pages/SearchResults';
import Stats from './pages/Stats';

function App() {
  return (
    <div className="App">
      <Navbar /> 

      <main>
        {/* 3. Aquí es donde el contenido cambiará */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/juego/:slug" element={<GameDetail />} />
          {/* <Route path="*" element={<PaginaNoEncontrada />} /> */}
          <Route path="/library" element={<Library />} /> 
          <Route path="/community" element={<Community />} /> 
          <Route path="/search" element={<SearchResults />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;