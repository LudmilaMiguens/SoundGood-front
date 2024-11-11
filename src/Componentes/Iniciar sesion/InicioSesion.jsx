import React, { useState, useEffect } from "react";
import logo from '../../logo/logo.png';
import "./InicioSesion.css";
import { useNavigate } from "react-router-dom";

export function PagInicioSesion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    

    // Función para manejar el envío del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validamos email y contraseña
        if (!validateEmail(email)) {
            setErrorMessage('El email debe ser válido.');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('La contraseña debe tener al menos una mayúscula, un número y un símbolo.');
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8080/autenticacion/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({
                    email,
                     contraseña: password,  
                }),
            });

            // Si la respuesta es exitosa (código 200), obtén el token
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access_token); // Guarda el token
                clearForm();
                navigate("/home");  // Redirige a la página principal
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Error al iniciar sesión. Inténtalo nuevamente.'); // Muestra el mensaje de error
            }
        } catch (error) {
            setErrorMessage('Error al intentar iniciar sesión. Inténtalo nuevamente.');
        }
    };

    // Validación para la contraseña
    const validatePassword = (password) => {
        const conditionPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return conditionPassword.test(password);
    };

    // Validación para el email
    const validateEmail = (email) => {
        const conditionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return conditionEmail.test(email);
    };

    // Limpiar el formulario
    const clearForm = () => {
        setEmail('');
        setPassword('');
        setErrorMessage('');
    };

    return (
        <div>
            <img src={logo} alt="Logo" className="Logo" />
            <form className="form" onSubmit={handleFormSubmit}>
                <input 
                    type="text" 
                    name="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Iniciar sesión</button>
                <div className="error-message">
                    {errorMessage ? errorMessage : ""}
                </div>
            </form>
        </div>
    );
}
