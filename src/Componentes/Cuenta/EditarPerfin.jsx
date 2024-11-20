import React, { useState, useEffect } from 'react';
import './EditarPerfil.css';
import './cuenta.css';
import { Link } from 'react-router-dom';
import { Nav } from '../Nav/Nav';
import Footer from '../Footer/Footer';

function EditaPerfil() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    userName: '',
    email: '',
    contraseña: '',
    fechaDeNacimiento: ''
  });
  const [mensajeGuardado, setMensajeGuardado] = useState(false);

  const token = localStorage.getItem('access_token');
  
  // Verifica si hay token antes de hacer la solicitud
  if (!token) {
    // Redirige o muestra un mensaje si no hay token
    console.error('No hay token de autenticación');
    // Aquí puedes redirigir a otra página si es necesario (ej. login)
    return;
  }

  // Obtención de los datos del perfil del usuario
  useEffect(() => {
    const obtenerDatosCliente = async () => {
      try {
        const response = await fetch('http://localhost:8080/usuarios/perfil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Error al obtener los datos del perfil');
        
        const data = await response.json();
        
        setUsuario(data); // Establece los datos del usuario en el estado

      } catch (error) {
        console.error('Error al obtener los datos del perfil:', error.message);
      }
    };

    obtenerDatosCliente();
  }, [token]); // Se ejecuta solo si el token cambia

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value
    }));
  };


  // Manejo del envío del formulario (actualización de perfil)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try { 
      const response = await fetch('http://localhost:8080/usuarios/perfil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(usuario)
      });

      const data = await response.json(); // Obtener respuesta de la API
      console.log(data);
      
      if (!response.ok) {
        setMensajeGuardado(false);
        throw new Error(data.message || 'No se pudo actualizar el perfil');
      }
      // Si la actualización es exitosa, muestra un mensaje temporal
      setMensajeGuardado(true);
      setTimeout(() => setMensajeGuardado(false), 3000);

    } catch (error) {
      console.error('Error al actualizar el perfil:', error.message);
    }
  };

  return (
    <>
      <div>
        <Nav />
      </div>
      <div className="container-editar-perfil">
        <h1>Editar perfil</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              className="input-editar-Perfil"
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Nombre usuario:</label>
            <input
              className="input-editar-Perfil"
              type="text"
              name="userName"
              value={usuario.userName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              className="input-editar-Perfil"
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              className="input-editar-Perfil"
              type="password"
              name="contraseña"
              value={usuario.contraseña}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Fecha de Nacimiento:</label>
            <input
              className="input-editar-Perfil"
              type="date"
              name="fechaDeNacimiento"
              value={usuario.fechaDeNacimiento}
              onChange={handleChange}
            />
          </div>
          <button className="btn-guardar" type="submit">Guardar Cambios</button>
          <div className="error-message">
            {mensajeGuardado && <p className="mensaje-guardado">Sus cambios han sido guardados</p>}
          </div>
          <Link to="/cuenta">
            <button className="btn-regresar">Regresar a cuenta</button>
          </Link>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );

}

export default EditaPerfil;
