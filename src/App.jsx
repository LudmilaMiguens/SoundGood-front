import './App.css'
import PagInicio from './Componentes/Pagina de Inicio/PagInicio';
import { PagRegistro } from './Componentes/Registro/Registro';
import './Componentes/Iniciar sesion/InicioSesion.css'
import AcercaDe from './Componentes/Footer/AcercaDe';
import PlanPremium from './Componentes/Footer/PlanPremium';
import VersionGratuita from './Componentes/Footer/VersionGratuita';
import Ayudas from './Componentes/Footer/Ayudas';
import { Inicio } from './Componentes/Inicio/Inicio';
import { Biblioteca } from './Componentes/Biblioteca/Biblioteca';
import { Nav } from './Componentes/Nav/Nav';
import { BrowserRouter as Router ,Route, Routes } from 'react-router-dom';
import {PagInicioSesion} from './Componentes/Iniciar sesion/InicioSesion'
import Cuenta from './Componentes/Cuenta/Cuenta';
import Premium from './Componentes/Cuenta/Premium';
import EditaPerfil from './Componentes/Cuenta/EditarPerfin';
import { PlayerProvider } from './Componentes/Reproductor musica/PlayerContext';

function App() {
    return (
        <PlayerProvider>

        
        <Router>
            <div className='bg-black'>
                <Routes>
                    <Route path="/" element={<PagInicio />} />
                    <Route path="/inicio-sesion" element={<PagInicioSesion/>}/>
                    <Route path="/registro" element={<PagRegistro />} />
                    <Route path="/home" element={<Inicio />} />
                    <Route path="/acerca-de" element={<AcercaDe />} />
                    <Route path="/plan-premium" element={<PlanPremium />} />
                    <Route path="/version-gratuita" element={<VersionGratuita />} />
                    <Route path="/ayudas" element={<Ayudas />} />
                    <Route path="/biblioteca" element={<Biblioteca />} />
                    <Route path="/nav" element={<Nav />} />
                    <Route path="/cuenta" element={<Cuenta/>} />
                    <Route path="/premium" element={<Premium/>} />
                    <Route path="/editar-Perfil" element={<EditaPerfil/>} />
                </Routes>
            </div>
        </Router>
</PlayerProvider>
      
    );
}

export default App