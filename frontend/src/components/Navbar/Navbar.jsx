// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react'; // Importamos useState
import './Navbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa'; // Iconos

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [isOpen, setIsOpen] = useState(false); // Para el menú móvil
  const [searchTerm, setSearchTerm] = useState(''); // Para el buscador

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Cierra el menú al salir
    navigate('/');
  };

  // Función de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setIsOpen(false); // Cierra el menú al buscar
      setSearchTerm(''); // Limpia el input
    }
  };

  // Función para alternar menú móvil
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* 1. Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          GameTracker
        </Link>

        {/* 2. Icono de Menú Hamburguesa (Solo visible en móvil) */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* 3. Menú Principal (Links + Buscador) */}
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          
          <div className="nav-links">
            <NavLink to="/" className="nav-item" onClick={() => setIsOpen(false)}>
              Inicio
            </NavLink>
            <NavLink to="/community" className="nav-item" onClick={() => setIsOpen(false)}>
              Comunidad
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/library" className="nav-item" onClick={() => setIsOpen(false)}>
                  Mi Biblioteca
                </NavLink>

                <NavLink to="/stats" className="nav-item" onClick={() => setIsOpen(false)}>
                  Estadísticas
                </NavLink>
              </>
            )}

            {isAuthenticated ? (
              <button onClick={handleLogout} className="nav-item btn-logout">
                Cerrar Sesión
              </button>
            ) : (
              <NavLink to="/login" className="nav-item btn-login" onClick={() => setIsOpen(false)}>
                Iniciar Sesión
              </NavLink>
            )}
          </div>

          {/* 4. Formulario de Búsqueda */}
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Buscar juegos o reseñas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;