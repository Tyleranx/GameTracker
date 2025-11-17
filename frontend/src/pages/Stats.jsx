import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
// Importamos componentes de Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import './Stats.css';

// Registramos los componentes de los gráficos
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
);

const Stats = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats`, {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, token, navigate]);

  if (loading) return <div className="stats-loading">Cargando dashboard...</div>;
  if (!stats) return <div className="stats-loading">Error al cargar datos</div>;

  // --- CONFIGURACIÓN DE DATOS PARA GRÁFICOS ---

  // 1. Datos para el gráfico de Pastel (Status)
  const doughnutData = {
    labels: ['Completado', 'Jugando', 'Pendiente', 'Abandonado'],
    datasets: [
      {
        label: '# de Juegos',
        data: [
          stats.statusDistribution.Completado,
          stats.statusDistribution.Jugando,
          stats.statusDistribution.Pendiente,
          stats.statusDistribution.Abandonado,
        ],
        backgroundColor: [
          '#28a745', // Verde
          '#007bff', // Azul
          '#6c757d', // Gris
          '#dc3545', // Rojo
        ],
        borderWidth: 1,
      },
    ],
  };

  // 2. Datos para el gráfico de Línea (Reseñas por mes)
  // Transformamos los datos del backend a etiquetas de meses
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  const lineLabels = stats.reviewsHistory.map(item => `${monthNames[item._id.month - 1]} ${item._id.year}`);
  const lineCounts = stats.reviewsHistory.map(item => item.count);

  const lineData = {
    labels: lineLabels.length > 0 ? lineLabels : ['Sin datos recientes'],
    datasets: [
      {
        label: 'Reseñas publicadas',
        data: lineCounts.length > 0 ? lineCounts : [0],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3, // Curva suave
      },
    ],
  };

  return (
    <div className="stats-container">
      <h1>Dashboard Personal</h1>
      
      {/* Tarjetas de Resumen */}
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total en Biblioteca</h3>
          <p className="stat-number">{stats.totalGames}</p>
        </div>
        <div className="stat-card">
          <h3>Juegos Completados</h3>
          <p className="stat-number success">{stats.statusDistribution.Completado}</p>
        </div>
        <div className="stat-card">
          <h3>Total Reseñas</h3>
          <p className="stat-number info">{stats.totalReviews}</p>
        </div>
        <div className="stat-card">
          <h3>Tasa de Finalización</h3>
          <p className="stat-number warning">
            {stats.totalGames > 0 
              ? Math.round((stats.statusDistribution.Completado / stats.totalGames) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-box">
          <h2>Estado de la Biblioteca</h2>
          <div className="chart-wrapper-doughnut">
             <Doughnut data={doughnutData} />
          </div>
        </div>
        
        <div className="chart-box">
          <h2>Actividad de Reseñas</h2>
          <div className="chart-wrapper-line">
            <Line options={{ responsive: true, maintainAspectRatio: false }} data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;