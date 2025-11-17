// src/hooks/useAuth.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // 1. Importa el contexto

// 2. Este es el hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};