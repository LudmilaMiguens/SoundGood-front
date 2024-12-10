import { Logo } from "../../logo/logo";
import './Nav.css';
import './modal.css';
import { useState, useEffect } from "react";
import ReproductorBuscador from "../Reproductor musica/ReproductorBuscador";
import { Link } from "react-router-dom";
import { SongCard } from '../Inicio/Card';
import { useFavorites } from '../Biblioteca/FavoritesContext';
import { usePlayer } from '../Reproductor musica/PlayerContext';
import { IoCloseCircleOutline } from "react-icons/io5";
import Slider from "react-slick";

const Song = {
    url: '',
    title: '',
    tags: []
};

export default function Nav() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);  // Modal de búsqueda
    const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false); // Modal de agregar a playlist
    const [cancionesTracks, setCancionesTracks] = useState([]);
    const { addFavorites,verificarFavorito, addSongToPlaylist, playlists, favorites, setFavorites} = useFavorites();
    const [playlistName, setPlaylistName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //const [currentSong, setCurrentSong] = useState(null);
    const { setCurrentSong } = usePlayer();
    const [selectedPlaylist, setSelectedPlaylist] = useState(''); // Playlist seleccionada
    const [selectedSongUrl, setSelectedSongUrl] = useState({});

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/canciones`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                setCancionesTracks(data);
            })
            .catch(error => {
                console.error('Error cargando las canciones:', error);
            });
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            return;
        }
        const filteredResults = [
            ...cancionesTracks.filter(song =>
                song.titulo.toLowerCase().includes(searchTerm.toLowerCase())
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
    const handleSongClickSong = (song) => {
        setSelectedSongUrl({
            url: `${import.meta.env.VITE_API_URL}/files/song/${song.songFilename}`,
            title: song.titulo,
            tags: song.genero?.generos || [],
        });
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


    const openPlaylistModal = (song) => {
        setCurrentSong(song); // Establece la canción seleccionada
        setPlaylistModalOpen(true); // Abrir el modal de agregar a playlist
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5, // Muestra 4 tarjetas
        slidesToScroll: 1, // Cambia de una tarjeta a la vez
        centerMode: true, // Activa el modo de centrado
        centerPadding: '5%', // Espacio adicional a los lados
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerPadding: '20px',
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: '20px',
                }
            }
        ]
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 w-full h-screen">
                    <div className="relative w-full lg:w-5/6 p-4 bg-white shadow-xl rounded-[25px] max-h-[80vh] overflow-hidden overflow-y-auto">
                        <span
                            onClick={() => setSearchModalOpen(false)}
                            className="absolute top-4 right-4 lg:top-8 lg:right-8 cursor-pointer"
                        >
                            <IoCloseCircleOutline className="w-4 h-4 md:w-10 md:h-10 text-red rounded-full" />
                        </span>
                        <h2 className=" mt-0 mb-3 text-2xl font-bold text-gray-800 text-center">Canciones encontradas</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-4 gap-5 content-between">
                          
                            {searchResults.map((song, index) => (
                                <SongCard
                                    song={song}
                                    key={index}
                                    onClick={() => {
                                        handleSongClickSong(song)
                                        setCurrentSong(song.url); // Establece la canción en el reproductor
                                    }}
                                    onFavorite={() =>
                                        addFavorites(song, verificarFavorito(favorites, song.cancionId), setFavorites)
                                    }
                                    valueFavorito={verificarFavorito(favorites, song.cancionId)}
                                    onAddToPlaylist={() => openModal(song)} // Asegúrate de que el modal se abre con la canción correcta
                                />
                            ))}
                            {selectedSongUrl.url &&
                <ReproductorBuscador
                    songUrl={selectedSongUrl.url}
                    title={selectedSongUrl.title}
                    tags={selectedSongUrl.tags} />}
                        
                        </ul>
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
              {selectedSongUrl.url &&
                <ReproductorBuscador
                    songUrl={selectedSongUrl.url}
                    title={selectedSongUrl.title}
                    tags={selectedSongUrl.tags} />}
        </nav>
    );
};
