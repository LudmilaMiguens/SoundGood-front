import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { SongCard } from "./Card";
// import './Inicio.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReproductorBuscador from '../Reproductor musica/ReproductorBuscador';
import { useFavorites } from '../Biblioteca/FavoritesContext';
import Modal from 'react-modal';
import { usePlayer } from '../Reproductor musica/PlayerContext';
 
Modal.setAppElement('#root'); // Establece el elemento raíz para accesibilidad

const Song = {
    url: '',
    title: '',
    tags: []
};

export default function Inicio() {
    const [songsTop10, setSongsTop10] = useState([]);
    const [songsTendencias, setSongsTendencias] = useState([]);
    const { addFavorites, verificarFavorito, addSongToPlaylist, playlists, setSelectedSongUrl, selectedSongUrl, favorites, setFavorites} = useFavorites();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState(''); // Playlist seleccionada
    const [errorMessage, setErrorMessage] = useState('');
    const { currentSong, setCurrentSong } = usePlayer();

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/canciones/top10`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                setSongsTop10(data);
            })
            .catch(error => {
                console.error('Error cargando las canciones:', error);
            });
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/canciones/favoritosByUser`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                setFavorites(data);
            })
            .catch(error => {
                console.error('Error cargando los favoritos:', error);
            });
    }, []);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/canciones/tendencias`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                setSongsTendencias(data);
            })
            .catch(error => {
                console.error('Error cargando las canciones:', error);
            });
    }, []);

    
    useEffect(() => {
        const token = localStorage.getItem('access_token');  // Obtén el token
        fetch(`${import.meta.env.VITE_API_URL}/playlists`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                setPlaylists(data);
                if (data.length > 0) {
                    setSelectedPlaylist(data[0]);
                }
            })
            .catch(error => {
                console.error('Error cargando los Playlists:', error);
            });
    }, []); 

    const openModal = (song) => {
        setCurrentSong(song.url); // Establece la canción en el contexto
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPlaylistName('');
        setSelectedPlaylist('');
        setErrorMessage('');
    };
    // Usa setSelectedSongUrl directamente desde el contexto
    const handleSongClickSong = (song) => {
        setSelectedSongUrl({
            url: `${import.meta.env.VITE_API_URL}/files/song/${song.songFilename}`,
            title: song.titulo,
            tags: song.genero?.generos || [],
        });
    };
    const handleAddToPlaylist = () => {
        if (selectedPlaylist) {
            const playlistSongs = playlists[selectedPlaylist];
            const isSongInPlaylist = playlistSongs.some(song => song.url === currentSong);

            if (isSongInPlaylist) {
                setErrorMessage('Esta canción ya está en esa playlist.');
            } else {
                const currentSongData = songsTop10.find(song => song.url === currentSong) || songsTendencias.find(song => song.url === currentSong);
                if (currentSongData) {
                    addSongToPlaylist(currentSongData, selectedPlaylist); // Agrega el objeto completo de la canción
                    console.log(`Canción añadida: ${currentSong}`);
                    closeModal();
                }
            }
        } else {
            setErrorMessage('Por favor selecciona una playlist.');
        }
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
        <div className="bg-black pb-8">
            <p className="section-title">Top 10</p>
            <div className="my-4">
                <Slider {...settings}>
                    {songsTop10.map((song, index) => (
                        <SongCard
                            song={song}
                            key={index}
                            onClick={() => {
                                handleSongClickSong(song)
                                setCurrentSong(song.url); // Establece la canción en el reproductor
                            }
                            }
                            onFavorite={() =>
                                addFavorites(song, verificarFavorito(favorites, song.cancionId), setFavorites)
                            }
                            valueFavorito={verificarFavorito(favorites, song.cancionId)}
                            onAddToPlaylist={() => openModal(song)}
                        />
                    ))}
                </Slider>
            </div>
            <p className="section-title">Tendencias</p>
            <div className="my-4">
                <Slider {...settings}>
                    {songsTendencias.map((song, index) => (
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
                </Slider>
            </div>
            {selectedSongUrl.url &&
                <ReproductorBuscador
                    songUrl={selectedSongUrl.url}
                    title={selectedSongUrl.title}
                    tags={selectedSongUrl.tags} />}

            {/* Modal para agregar a playlist */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal-overlay"
            ><div>

            </div>
                <div className="modal-playlist">
                    <div className="modal-content-playlist">
                    <h3>Añadir a Playlist</h3>
                    <select
                        className="modal-select-playlist"
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                    >
                        <option value="">Selecciona una playlist</option>
                        {playlists.length > 0 && playlists.map((playlist) => (
                            <option key={playlist.playlistId} value={playlist.playlistId}>{playlist.title}</option>
                        ))}
                    </select>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="modal-buttons">
                        <button onClick={handleAddToPlaylist}>Añadir</button>
                        <button onClick={closeModal}>Cancelar</button>
                    </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
