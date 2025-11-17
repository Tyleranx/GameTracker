// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <--- 1. IMPORTANTE: Importar Link
import './Footer.css';
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <h3 className="footer-sitename">GameTracker</h3>
        <div className="footer-socials">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
        </div>
      </div>

      <div className="footer-right">
        <div className="footer-column">
          {/* 2. Cambiamos el título "Topic" por algo más real */}
          <h4>Explorar</h4>
          
          {/* 3. Links limpios sin lógica de menú móvil (onClick eliminado) */}
          {/* Nota: Usamos las clases por defecto del footer, no las del navbar */}
          <Link to="/">
            Inicio
          </Link>
          
          <Link to="/community">
            Comunidad
          </Link>

          {/* Opcional: Agregar link a login o biblioteca */}
          <Link to="/login">Ingresar</Link>
        </div>
        
        {/* Puedes agregar otra columna si quieres */}
        <div className="footer-column">
           <h4>Legal</h4>
           <Link to="#">Términos</Link>
           <Link to="#">Privacidad</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;