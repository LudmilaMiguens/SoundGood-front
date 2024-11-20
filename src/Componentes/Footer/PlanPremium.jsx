import React from 'react';
import './Links.css';
import { Link } from 'react-router-dom';
function PlanPremium() {
    return (
        <div className='container-link'>
            <h1>Plan Premium</h1>
            <h2>Notá la diferencia.</h2>
            <p>Elegí un plan Premium y escuchá música sin anuncios y sin límites en tu teléfono, parlante y otros dispositivos. Accedé a varias formas de pago. Cancelá cuando quieras.</p>
            <h2>Todos los planes Premium incluyen lo siguiente:</h2>
            <ul>
                <li>Música sin anuncios</li>
                <li>Descargá y escuchá contenido en modo offline</li>
                <li>Reproducí canciones en el orden que quieras</li>
                <li>Audio de alta calidad</li>
                <li>Escuchá contenido con tus personas favoritas en tiempo real</li>
                <li>Organizá la fila de reproducción</li>
            </ul>
            <h2>¿Cómo cancelo mi plan Premium?</h2>
            <p>Podés cancelar tu plan Premium fácilmente y en cualquier momento en línea desde la página de tu cuenta. Vas a conservar tu suscripción Premium hasta la próxima fecha de facturación. Luego, la cuenta va a pasar a nuestro servicio gratuito.</p>
            <Link to="/home">
                <button className="green-button">Volver a Inicio</button>
            </Link>
        </div>
    );
}

export default PlanPremium;
