// context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null); // 
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando

  useEffect(() => {
    const loadUser = async () => {
      const tokenInStorage = localStorage.getItem('token');
      if (tokenInStorage) {
        setToken(tokenInStorage);
        setIsAuthenticated(true);
        try {
          // 1. Llama a la nueva ruta /api/auth/me
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
            headers: {
              'x-auth-token': tokenInStorage,
            },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData); // <-- Guarda el usuario
          } else {
            // Token inválido
            logout();
          }
        } catch  {
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []); // Se ejecuta solo una vez al cargar la app

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    // (Idealmente, loadUser() debería llamarse aquí también)
    // Por ahora, recargar la página funcionará, o podemos implementarlo
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null); // <-- Limpia el usuario
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    token,
    user, // <-- Expone el usuario
    loading, // <-- Expone el estado de carga
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};