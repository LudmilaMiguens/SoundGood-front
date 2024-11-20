import { Logo } from "../../logo/logo";
import './Nav.css';
import './modal.css';
import { useState, useEffect } from "react";
import ReproductorNav from "../Reproductor musica/ReproductorBuscador";
import { Link } from "react-router-dom";
import { SongCard } from '../Inicio/Card';
import { useFavorites } from '../Biblioteca/FavoritesContext';
import { usePlayer } from '../Reproductor musica/PlayerContext';
 
export const Nav = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);  // Modal de búsqueda
    const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false); // Modal de agregar a playlist
    const [songUrlReproductor, setSongUrlReproductor] = useState(null);
    const [top50Tracks, setTop50Tracks] = useState([]);
    const [cancionesTracks, setCancionesTracks] = useState([]);
    const { addFavorite, addSongToPlaylist, playlists } = useFavorites();
    const [playlistName, setPlaylistName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //const [currentSong, setCurrentSong] = useState(null);
    const { setCurrentSong} = usePlayer();
    const [selectedPlaylist, setSelectedPlaylist] = useState
    (''); // Playlist seleccionada
  
    useEffect(() => {
        fetch('/CancionesTop50.json')
            .then(response => response.json())
            .then(data => setTop50Tracks(data))
            .catch(error => console.error('Error al obtener datos:', error));
    }, []);

    useEffect(() => {
        fetch('/Canciones.json')
            .then(response => response.json())
            .then(data => setCancionesTracks(data))
            .catch(error => console.error('Error loading the otra lista tracks:', error));
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            return;
        }
        const filteredResults = [
            ...top50Tracks.filter(song =>
                song.title.toLowerCase().includes(searchTerm.toLowerCase())
            ),
            ...cancionesTracks.filter(song =>
                song.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        ];
        setSearchResults(filteredResults);
        setSearchModalOpen(true); // Abrir el modal de búsqueda
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSongSelec = (url) => {
        setSongUrlReproductor(url);
        setCurrentSong(url); // Establece la canción en el contexto
        setSearchModalOpen(false); // Cierra el modal de búsqueda
        setPlaylistModalOpen(false); // Cierra el modal de playlist, si está abierto
    };

   const handleAddToPlaylist = () => {
        if (selectedPlaylist) {
            // Verifica si la playlist seleccionada ya tiene la canción actual
            //Usamos el método some para verificar si alguna de las canciones en la playlist seleccionada 
            //tiene el mismo url que la canción actual (currentSong).
            const playlistSongs = playlists[selectedPlaylist];
            const isSongInPlaylist = playlistSongs.some(song => song.url === currentSong);

            if (isSongInPlaylist) {
                setErrorMessage('Esta canción ya está en esa playlist.');
            } else {
                // Si no está en la playlist, la añade
                addSongToPlaylist(currentSong, selectedPlaylist);
                console.log(`Canción añadida: ${currentSong}`);
                console.log('Canciones en la playlist:', playlists[selectedPlaylist]);
                closeModal();
            }
        } else {
            setErrorMessage('Por favor selecciona una playlist.');
        }
    };

    const handleFavorite = (song) => {
        addFavorite(song); // Añade la canción a favoritos
    };

    const openPlaylistModal = (song) => {
        setCurrentSong(song); // Establece la canción seleccionada
        setPlaylistModalOpen(true); // Abrir el modal de agregar a playlist
    };

    return (
        <nav>
            <div className="navbar">
                <div className="nav-logo">
                    <Link to="/home">
                        <Logo />
                    </Link>
                </div>
                <div className="nav-buscador">
                    <input type="text"
                        placeholder="Qué querés escuchar hoy?..."
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
                                        url={song.url}
                                        title={song.title}
                                        image={song.image}
                                        artist={song.artist}
                                        tags={song.tags || []}
                                        onClick={() => handleSongSelec(song.url)}
                                        onFavorite={() => handleFavorite(song)}
                                        onAddToPlaylist={() => openPlaylistModal(song)}  // Abre el modal de playlist
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {isPlaylistModalOpen && (
                <div className="modal-playlist" onClick={() => setPlaylistModalOpen(false)}>
                    <div className="modal-content-playlist" onClick={(e) => e.stopPropagation()}>
                        <h3>Añadir a Playlist</h3>
                        {/* Dropdown para seleccionar la playlist- el value es la playlist seleccionada 
                            por el usuario (selectedPlaylist), y se actualiza con el método onChange. */}
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
                            {/*Si el usuario intenta añadir una canción sin seleccionar una playlist, aparecerá un mensaje de error.*/}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button onClick={handleAddToPlaylist}>Añadir</button>
                        <button onClick={() => setPlaylistModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
            <ReproductorNav songUrl={songUrlReproductor} />
        </nav>
    );
};
