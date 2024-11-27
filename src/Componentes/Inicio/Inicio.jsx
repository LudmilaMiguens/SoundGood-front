import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { SongCard } from "./Card";
import './card.css';
import './Inicio.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Nav } from "../Nav/Nav";
import ReproductorBuscador from '../Reproductor musica/ReproductorBuscador';
import Footer from "../Footer/Footer";
import { useFavorites } from '../Biblioteca/FavoritesContext';
import Modal from 'react-modal';
Modal.setAppElement('#root'); // Establece el elemento raíz para accesibilidad
import { usePlayer } from '../Reproductor musica/PlayerContext';
import Swal from "sweetalert2";

const Song = {
    url: '',
    title: '',
    tags: []
};

export function Inicio({ redirectToAcercaDe, redirectToPlanPremium, redirectToVersionGratuita, redirectToAyudas }) {
    const [songsTop10, setSongsTop10] = useState([]);
    const [songsTendencias, setSongsTendencias] = useState([]);
    const [selectedSongUrl, setSelectedSongUrl] = useState(Song);
    const { addFavorite, addSongToPlaylist, playlists } = useFavorites();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState(''); // Playlist seleccionada
    const [errorMessage, setErrorMessage] = useState('');
    const { currentSong, setCurrentSong } = usePlayer();

    useEffect(() => {
        fetch('http://localhost:8080/top10')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                setSongsTop10(data[0].cancionId);
                
            })
            .catch(error => {
                console.error('Error cargando las canciones:', error);
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/tendencias')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                setSongsTendencias(data[0].cancionId);
            })
            .catch(error => {
                console.error('Error cargando las canciones:', error);
            });
    }, []);

    const addFavorites = async (song) => {

        const token = localStorage.getItem('access_token');

        try {
           const response = await fetch('http://localhost:8080/favoritos/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "usuarioId": 1,
                    "cancionId": [
                        song.cancionId
                    ]
                }),
            });
            if (response.ok) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Tu canción se agrego correctamente",
                    showConfirmButton: false,
                    timer: 2500
                  });
                console.log('todo anda bien por aca ');
             

            }
           console.log(song.cancionId);
           

        } catch (error) {
            console.error('Error en la solicitud de agregar favoritos', error);
            setErrorMessage('Error al intentar agregra a favoritos. Inténtalo nuevamente.')
        }
    }

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
        slidesToShow: 4, // Muestra 4 tarjetas
        slidesToScroll: 1, // Cambia de una tarjeta a la vez
        centerMode: true, // Activa el modo de centrado
        centerPadding: '110px', // Espacio adicional a los lados
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
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
        <>
            <Nav />
            <div className="home">
                <p className="section-title">Top 10</p>
                <Slider {...settings}>
                    {songsTop10.map((song, index) => (
                        <SongCard
                            key={index}
                            image={'http://localhost:8080/files/image/' + song.imageFilename}
                            title={song.titulo}
                            tags={[song.genero]}
                            url={'http://localhost:8080/files/song/' + song.songFilename}
                            onClick={() => {
                                setSelectedSongUrl({ url: 'http://localhost:8080/files/song/' + song.songFilename,
                                     title: song.titulo, 
                                     tags: [song.genero] 
                                    });
                                setCurrentSong(song.url); // Establece la canción en el contexto del reproductor
                            }}
                            onFavorite={() => addFavorites(song)}
                            onAddToPlaylist={() => openModal(song)}
                        />
                    ))}
                </Slider>
                <p className="section-title">Tendencias</p>
                <Slider {...settings}>
                    {songsTendencias.map((song, index) => (
                        <SongCard
                            key={index}
                            image={'http://localhost:8080/files/image/' + song.imageFilename}
                            title={song.titulo}
                            tags={[song.genero]}
                            url={'http://localhost:8080/files/song/' + song.songFilename}
                            artist={[song.artistas.nombre]}
                            onClick={() => {
                                setSelectedSongUrl({ url: 'http://localhost:8080/files/song/' + song.songFilename, title: song.titulo, tags: [song.genero], artist: [song.artistas] });

                                setCurrentSong(song.url);
                            }}
                            onFavorite={() => addFavorites(song)}
                            onAddToPlaylist={() => openModal(song)} // Asegúrate de que el modal se abre con la canción correcta
                        />

                    ))}
                </Slider>
                {selectedSongUrl.url && <ReproductorBuscador songUrl={selectedSongUrl.url} title={selectedSongUrl.title} tags={selectedSongUrl.tags} />}
                <Footer
                    redirectToAcercaDe={redirectToAcercaDe}
                    redirectToPlanPremium={redirectToPlanPremium}
                    redirectToVersionGratuita={redirectToVersionGratuita}
                    redirectToAyudas={redirectToAyudas}
                />

                {/* Modal para agregar a playlist */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    className="modal-overlay"
                >
                    <div className="Modal-playlist">
                        <h2>Añadir a Playlist</h2>
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
                        <div className="modal-buttons">
                            <button onClick={handleAddToPlaylist}>Añadir</button>
                            <button onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}
