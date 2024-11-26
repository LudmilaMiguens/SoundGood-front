import { Logo } from "../../logo/logo";
import './Nav.css';
import './modal.css';
import { useState } from "react";
import ReproductorBuscador from "../Reproductor musica/ReproductorBuscador";
import { Link } from "react-router-dom";
import { SongCard } from '../Inicio/Card';
import { useFavorites } from '../Biblioteca/FavoritesContext';
import { usePlayer } from '../Reproductor musica/PlayerContext';

const Song = {
    url: '',
    title: '',
    tags: []
};

export const Nav = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);  // Modal de búsqueda
    const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false); // Modal de agregar a playlist
    const [songUrlReproductor, setSongUrlReproductor] = useState(Song);
    const { addFavorite, addSongToPlaylist, playlists } = useFavorites();
    const [playlistName, setPlaylistName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState(''); // Playlist seleccionada
    const [selectedSongUrl, setSelectedSongUrl] = useState(Song);
    const { currentSong, setCurrentSong } = usePlayer();

    // Nueva función para buscar canciones en el backend
    const handleSearch = async () => {
        if (searchTerm.trim() === '') return;
    
        try {
            const response = await fetch(`http://localhost:8080/canciones/buscar/titulo?titulo=${encodeURIComponent(searchTerm)}`);
    
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            const result = await response.json();
    
            if (Array.isArray(result)) {
                setSearchResults(result);  
            } else {
                setSearchResults([result]);  
            }
    
            setSearchModalOpen(true);
        } catch (error) {
            console.error('Error al buscar la canción:', error);
        }
    };
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    /*const handleSongSelect = (song) => {
        setSongUrlReproductor({ ...song });
        setCurrentSong(song.url);
        setSearchModalOpen(false);
        setPlaylistModalOpen(false);
    };*/

    return (
        <nav>
            <div className="navbar">
                <div className="nav-logo">
                    <Link to="/home">
                        <Logo />
                    </Link>
                </div>
                <div className="nav-buscador">
                    <input
                        type="text"
                        placeholder="¿Qué querés escuchar hoy?... "
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button type="button" onClick={handleSearch}>Buscar</button>
                </div>
                <div className="nav-links">
                    <Link to="/biblioteca">Biblioteca</Link>
                    <Link to="/cuenta">Cuenta</Link>
                </div>
            </div>

            {isSearchModalOpen && (
                <div className="modal-overlay">
                    <div className="modalNav">
                        <div className="modal-content">
                            <span className="close" onClick={() => setSearchModalOpen(false)}>×</span>
                            <h2>Canciones encontradas:</h2>
                            <ul className="card-nav">
                                {searchResults.map((song, index) => (
                                    <SongCard
                                        key={index}
                                        image={'http://localhost:8080/files/image/' + song.imageFilename}
                                        title={song.titulo}
                                        tags={[song.genero]} 
                                        url={'http://localhost:8080/files/song/' + song.songFilename}
                                        onClick={() => {  
                                            setSelectedSongUrl({
                                                url: 'http://localhost:8080/files/song/' + song.songFilename, 
                                                title: song.titulo,
                                                tags: [song.genero]
                                            });
                                            setCurrentSong(song.url);
                                        }}
                                        onFavorite={() => addFavorite(song)}
                                        onAddToPlaylist={() => openPlaylistModal(song)} //falta la funcionalidad de los btn fav y playlist 
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para añadir a playlist */}
            {isPlaylistModalOpen && (
                <div className="modal-playlist" onClick={() => setPlaylistModalOpen(false)}>
                    <div className="modal-content-playlist" onClick={(e) => e.stopPropagation()}>
                        <h3>Añadir a Playlist</h3>
                        <select
                            className="modal-select-playlist"
                            value={selectedPlaylist}
                            onChange={(e) => setSelectedPlaylist(e.target.value)}
                        >
                            <option value="">Selecciona una playlist</option>
                            {Object.keys(playlists).map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button onClick={handleAddToPlaylist}>Añadir</button>
                        <button onClick={() => setPlaylistModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
            <ReproductorBuscador songUrl={songUrlReproductor.url} title={songUrlReproductor.title} tags={songUrlReproductor.tags} />
        </nav>
    );
};

