// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const { email, password } = formData;

  const { login } = useAuth();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userToLogin = {
        email,
        password,
      };

      // 1. Hacemos la petición POST con Fetch
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToLogin),
      });

      // 2. Obtenemos la respuesta
      const data = await res.json();

      // 3. Verificamos si hay un error
      if (!res.ok) {
        throw new Error(data.errors[0].msg || 'Credenciales inválidas');
      }
      
      // 4. Si todo OK, guardamos el token y redirigimos
      login(data.token); 
      setError(null);
      navigate('/'); 

    } catch (err) {
      // 5. Capturamos el error
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <form className="login-form" onSubmit={onSubmit}>
          <h2>Iniciar Sesión</h2>
          
          {/* Mostramos el error si existe */}
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            Entrar
          </button>

          <div className="form-footer-links">
            <p className="signup-link">
              ¿No tienes cuenta? <Link to="/SignIn">Regístrate aquí</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;