import React from 'react';
import './Links.css';
import { Link } from 'react-router-dom';

function VersionGratuita() {
    return (
        <div className='container-link'>
            <h1>Versión Gratuita!!!</h1>
            <h2>Reproducí millones de canciones y podcasts de forma gratuita.</h2>
            <h2>¿Por qué elegir Soundgood?</h2>
            <ul>
                <li>Reproducí tus canciones favoritas.</li>
                <li>Escuchá las canciones que te encantan y descubrí música y podcasts nuevos.</li>
                <li>Te vamos ayudar a crear playlists. O podés disfrutar de playlists hechas por expertos en música.</li>
                <li>Contanos qué te gusta y te vamos a recomendar música para vos.</li>
                <li>Activá el Ahorro de datos desde Configuración y consumí menos datos cuando escuches tu música.</li>
            </ul>
            <Link to="/home">
                <button className="green-buttons">Volver a Inicio</button>
            </Link>
        </div>
    );
}

export default VersionGratuita;
