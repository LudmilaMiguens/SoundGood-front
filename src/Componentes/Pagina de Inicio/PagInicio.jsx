// en esta seccion se muestra la pagina de inicio para registro e inicio de seccion
import React from "react";
import logo from '../../logo/logo.png'
import Reproductor from '../Reproductor musica/Reproductor';
import { Link } from "react-router-dom";
import './PagInicio.css';

//El componente PagInicio recibe dos props
function PagInicio() {
    return (
        <div className="h-full">
            <div className="h-3/4 flex flex-col items-center justify-center">
                <img src={logo} alt="Logo" className="w-1/2 lg:w-1/5" />


                <div className="flex">
                    <Link to="/inicio-sesion">
                        <button className="green-button">Iniciar sesión</button>
                    </Link>

                    <Link to="/registro">
                        <button className="green-button">Registrate</button>
                    </Link>
                </div>
            </div>

            <div>
                <Reproductor />
            </div>

        </div>

    );

}

export default PagInicio;