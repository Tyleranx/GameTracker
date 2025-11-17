// src/pages/Biblioteca.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LibraryCard from '../components/LibraryCard/LibraryCard'; // Crearemos esto
import EditProgressModal from '../components/EditProgressModal/EditProgressModal'; // Crearemos esto
import './Library.css';
import Swal from 'sweetalert2';

const Library = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la selección múltiple
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedGames, setSelectedGames] = useState([]); // Array de IDs de UserGame

  // Estados para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState(null); // La entrada UserGame a editar

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cargar juegos de la biblioteca
  useEffect(() => {
    // Esta función se ejecutará cada vez que el estado de auth cambie
    
    if (!isAuthenticated) {
      // 1. Si el usuario no está autenticado, lo saca al login
      navigate('/login');
    } else {
      // 2. Si ESTÁ autenticado, carga sus juegos
      const fetchUserGames = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/library`, {
            headers: {
              'x-auth-token': token,
            },
          });
          
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.msg || 'Error al cargar tu biblioteca');
          }

          const data = await res.json();
          setUserGames(data);
          setError(null);
          
        } catch (err) {
          setError(err.message);
          console.error('Error fetching library:', err);
          // Mostramos un error si la carga falla
          Swal.fire({
            icon: 'error',
            title: 'Error al Cargar',
            text: err.message,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchUserGames();
    }
  }, [isAuthenticated, navigate, token]); 

  // --- Lógica de Selección Múltiple ---
  const toggleSelection = (userGameId) => {
    setSelectedGames((prevSelected) =>
      prevSelected.includes(userGameId)
        ? prevSelected.filter((id) => id !== userGameId)
        : [...prevSelected, userGameId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedGames.length === 0) return;

  Swal.fire({
      title: `¿Estás seguro?`,
      text: `¡No podrás revertir esto! Se eliminarán ${selectedGames.length} juegos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/library`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token,
            },
            body: JSON.stringify({ ids: selectedGames }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.msg || 'Error al eliminar juegos.');
          }

          setUserGames(prevGames => prevGames.filter(game => !selectedGames.includes(game._id)));
          setSelectedGames([]);
          setSelectionMode(false);
          
          Swal.fire(
            '¡Eliminados!',
            'Los juegos han sido eliminados de tu biblioteca.',
            'success'
          );

        } catch (err) {
          console.error('Error al eliminar múltiples juegos:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message,
          });
        }
      }
    });
  };

  const handleDeleteOne = (userGameId) => {
    // Usamos Swal para confirmar, igual que en el borrado múltiple
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', // Rojo para eliminar
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, ¡eliminar!',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
        try {
            // Hacemos la petición DELETE a la API con el ID específico
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/library/${userGameId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token,
            },
            });

            if (!res.ok) {
            const data = await res.json();
            throw new Error(data.msg || 'Error al eliminar el juego.');
            }

            // Actualizamos el estado del frontend para que el juego desaparezca
            setUserGames(prevGames => prevGames.filter(game => game._id !== userGameId));

            Swal.fire(
            '¡Eliminado!',
            'El juego ha sido eliminado de tu biblioteca.',
            'success'
            );

        } catch (err) {
            console.error('Error al eliminar juego:', err);
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message,
            });
        }
        }
    });
  };

  // --- Lógica de Edición (Modal) ---
  const handleOpenEditModal = (userGame) => {
    setGameToEdit(userGame);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setGameToEdit(null);
  };

  const handleUpdateGame = async (updatedGameData) => {
    if (!gameToEdit) return;

    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/library/${gameToEdit._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify(updatedGameData), // { status: "Completado", progress: 100 }
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Error al actualizar el juego.');
        }

        // Actualizar el juego en el estado local de React
        setUserGames(prevGames => 
            prevGames.map(game => 
                game._id === data._id ? data : game // Reemplaza la entrada actualizada
            )
        );
        handleCloseEditModal(); // Cerrar el modal
        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'El estado de tu juego ha sido guardado.',
            timer: 1500, // Cierra automáticamente después de 1.5s
            showConfirmButton: false
        });
    } catch (err) {
      setError(err.message);
      console.error('Error al actualizar el juego:', err);
      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message,
      });
    }
  };

  if (!isAuthenticated) return null; // No renderizar nada si no está autenticado (la redirección ya se encargó)

  if (loading) return <div className="library-message">Cargando tu biblioteca...</div>;
  if (error) return <div className="library-message error">{error}</div>;
  if (userGames.length === 0 && !loading) return <div className="library-message">Tu biblioteca está vacía. ¡Añade algunos juegos!</div>;

  return (
    <div className="biblioteca-container">
      <div className="biblioteca-header">
        <h1>Mi Biblioteca de Juegos</h1>
        <div className="biblioteca-actions">
          <button 
            onClick={() => setSelectionMode(!selectionMode)} 
            className={`btn ${selectionMode ? 'btn-cancel-selection' : 'btn-select'}`}
          >
            {selectionMode ? 'Cancelar Selección' : 'Seleccionar'}
          </button>
          {selectionMode && (
            <button 
              onClick={handleDeleteSelected} 
              className="btn btn-delete-selected" 
              disabled={selectedGames.length === 0}
            >
              Eliminar ({selectedGames.length})
            </button>
          )}
        </div>
      </div>

      <div className="library-grid">
        {userGames.map((userGame) => (
          <LibraryCard
            key={userGame._id}
            userGame={userGame}
            selectionMode={selectionMode}
            isSelected={selectedGames.includes(userGame._id)}
            onToggleSelection={toggleSelection}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteOne} 
          />
        ))}
      </div>

      {isModalOpen && gameToEdit && (
        <EditProgressModal
          userGame={gameToEdit}
          onClose={handleCloseEditModal}
          onSave={handleUpdateGame}
        />
      )}
    </div>
  );
};

export default Library;