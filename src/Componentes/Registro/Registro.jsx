import React, { useState } from "react";
import logo from '../../logo/logo.png';
import './Registro.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export function PagRegistro() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(null);
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validaciones de campos
        if (!validateEmail(email)) {
            setErrorMessage('El email debe ser válido.');
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage('La contraseña debe tener al menos una mayúscula, un número y un símbolo.');
            return;
        }
        if (nombre.trim() === '') {
            setErrorMessage('Por favor, ingresa tu nombre.');
            return;
        }
        if (!fechaNacimiento) {
            setErrorMessage('Por favor, selecciona tu fecha de nacimiento.');
            return;
        }
        if (!validateFechaNacimiento(fechaNacimiento)) {
            setErrorMessage('La fecha de nacimiento debe ser anterior al 1 de enero de 2023.');
            return;
        }

        // Envío de datos al backend
        try {
            const response = await fetch('http://localhost:8080/autenticacion/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    userName,
                    fechaNacimiento: fechaNacimiento ? fechaNacimiento.toISOString().split('T')[0] : null,
                    email,
                    contraseña: password,
                })
            });

            const data = await response.json(); 

            if (response.status === 201) {
                clearForm();
                navigate("/inicio-sesion");
            } else {
                setErrorMessage(data.message || 'Error al registrar usuario. Inténtalo nuevamente.');
            }
        } catch (error) {
            setErrorMessage('Error al registrar usuario. Inténtalo nuevamente.');
        }
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    const validateFechaNacimiento = (date) => date < new Date('2023-01-01');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errorMessage && validatePassword(e.target.value)) setErrorMessage('');
    };

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setNombre('');
        setUserName('');
        setFechaNacimiento(null);
    };

    return (
        <div>
            <div className="container-logo">
                <img src={logo} alt="Logo" className="Logo" />
            </div>
            <form className="form" onSubmit={handleFormSubmit}>
                <input type="text" name="nombre" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                <input type="text" name="userName" placeholder="UserName" value={userName} onChange={handleUserNameChange} required />

                <DatePicker
                    selected={fechaNacimiento}
                    onChange={(date) => setFechaNacimiento(date)}
                    placeholderText="Fecha de nacimiento"
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    popperPlacement="bottom-start"
                    popperModifiers={{
                        preventOverflow: {
                            enabled: true,
                            boundariesElement: 'viewport'
                        }
                    }}
                />
                <input type="text" name="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
                <input type="password" name="password" placeholder="Contraseña" value={password} onChange={handlePasswordChange} required />

                <div className="parrafos">
                    <p>Términos y Condiciones de SoundGood</p>
                    <p>Al registrarte en SoundGood, aceptas nuestros términos y condiciones. Por favor, asegúrate de revisarlos periódicamente, ya que pueden cambiar. Gracias por unirte a nuestra comunidad musical.</p>
                </div>
                <button type="submit">Aceptar y registrarse</button>

                <div className="error-message">
                    {errorMessage ? errorMessage : ""}
                </div>
            </form>
        </div>
    );
}
