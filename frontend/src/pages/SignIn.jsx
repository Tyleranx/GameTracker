import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css'; // Usaremos un CSS propio pero similar al de Login
import { useAuth } from '../hooks/useAuth';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // Corregido, faltaba 'confirmPassword'
    });
    const [error, setError] = useState(null);

    const { username, email, password, confirmPassword } = formData;

    const { login } = useAuth();

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validación simple en el frontend
        if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
        }
        if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
        }

        try {
        const newUser = {
            username,
            email,
            password,
        };

        // 1. Hacemos la petición POST con Fetch
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser), // Convertimos el objeto a un string JSON
        });

        // 2. Obtenemos la respuesta como JSON
        const data = await res.json();

        // 3. Verificamos si el backend nos devolvió un error (ej: email ya existe)
        if (!res.ok) {
            // 'res.ok' es 'false' si el status es 400, 500, etc.
            // Asumimos que el error viene en 'data.errors' como definimos en el backend
            throw new Error(data.errors[0].msg || 'Algo salió mal');
        }

        // 4. Si todo salió bien (res.ok es 'true')
        login(data.token); // Guardamos el token
        setError(null);
        navigate('/'); 
        } catch (err) {
        // 5. Capturamos el error (de la red o del 'throw new Error' de arriba)
        console.error(err.message);
        setError(err.message);
        }
    };

    return (
        <div className="registro-page-container">
        <div className="registro-form-box">
            <form className="registro-form" onSubmit={onSubmit}>
            <h2>Crear Cuenta</h2>
            
            {/* Mostramos el error si existe */}
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input
                type="text"
                id="username"
                name="username" // 'name' debe coincidir con el estado
                value={username}
                onChange={onChange}
                placeholder="Tu nombre de usuario"
                required
                />
            </div>

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
                placeholder="Crea una contraseña (mín. 6 caracteres)"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                type="password"
                id="confirmPassword"
                name="confirmPassword" // 'name' debe coincidir con el estado
                value={confirmPassword}
                onChange={onChange}
                placeholder="Repite la contraseña"
                required
                />
            </div>

            <button type="submit" className="registro-submit-btn">
                Registrarme
            </button>

            <div className="form-footer-links">
                <p className="login-link">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
            </form>
        </div>
        </div>
    );
};

export default SignIn;