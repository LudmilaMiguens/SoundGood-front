import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { SongCard } from "./Card";
import './card.css';
import './Inicio.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Nav } from "../Nav/Nav";
import Reproductor from '../Reproductor musica/ReproductorBuscador';
import Footer from "../Footer/Footer";
import { useFavorites } from '../Biblioteca/FavoritesContext';
import Modal from 'react-modal';
Modal.setAppElement('#root'); // Establece el elemento raíz para accesibilidad
import { usePlayer } from '../Reproductor musica/PlayerContext';

export function Inicio({ redirectToAcercaDe, redirectToPlanPremium, redirectToVersionGratuita, redirectToAyudas }) {
    const [Top10, setTop10] = useState([]);
    const [Tendencias, setTendencias] = useState([]);
    const [selectedSongUrl, setSelectedSongUrl] = useState(null);
    const { addFavorite, addSongToPlaylist, playlists } = useFavorites();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState(''); // Playlist seleccionada
    const [errorMessage, setErrorMessage] = useState('');
    const { currentSong, setCurrentSong } = usePlayer();

    useEffect(() => {
        //obtener las canciones de top10
        const obtenerTop10 = async () =>{
            try {
                const response = await fetch('http://localhost:8080/top10',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok) throw new Error('Error al obtener los datos de top 10');
                const data = await response.json();
                setTop10(data[0].canciones);
                console.log(data[0].canciones)
            } catch (error) {
                console.error('Error al obtener las canciones de top 10', error.message);              
            }
        };
        obtenerTop10();   
    },[]);

    useEffect(() => {
        //obtener las canciones de tendencias
        const obtenerTendencias= async () =>{
            try {
                const response = await fetch('http://localhost:8080/tendencias',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!response.ok) throw new Error('Error al obtener los datos de tendencia');
                const data = await response.json();
                setTop10(data[0].canciones);
                console.log(data[0].canciones)
            } catch (error) {
                console.error('Error al obtener las canciones de tendencia', error.message);              
            }
        };
        obtenerTendencias();   
    },[]);

    const openModal = (song) => {
        setCurrentSong(song.songFilename); // Establece la canción en el contexto
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
            const isSongInPlaylist = playlistSongs.some(song => song.songFilename === currentSong);

            if (isSongInPlaylist) {
                setErrorMessage('Esta canción ya está en esa playlist.');
            } else {
                const currentSongData = Top10.find(song => song.url === currentSong) || Tendencias.find(song => song.songFilename === currentSong);
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

    /*  const handleAddToPlaylist = () => {
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
      };*/


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
            <div>
                <Nav />
            </div>
            <div className="home">
                <p className="section-title">Top 10</p>
                <Slider {...settings}>
                    {Top10.map((song, index) => (
                        <SongCard
                            key={index}
                            image={song.imageFilename}
                            title={song.titulo}
                            tags={song.tags} //genero 
                            url={song.songFilename}
                            onClick={() => {
                                setSelectedSongUrl(song.songFilename);
                                setCurrentSong(song.songFilename); // Establece la canción en el contexto del reproductor
                            }}
                            onFavorite={() => addFavorite(song)}
                            onAddToPlaylist={() => openModal(song)}
                        />
                    ))}
                </Slider>
                <p className="section-title">Tendencias</p>
                <Slider {...settings}>
                    {Tendencias.map((song, index) => (
                        <SongCard
                            key={index}
                            image={song.imageFilename}
                            title={song.titulo}
                            tags={song.tags}
                            url={song.songFilename}
                            artist={song.artist}
                            onClick={() => {
                                setSelectedSongUrl(song.songFilename);
                                setCurrentSong(song.songFilename);
                            }}
                            onFavorite={() => addFavorite(song)}
                            onAddToPlaylist={() => openModal(song)} // Asegúrate de que el modal se abre con la canción correcta
                        />

                    ))}
                </Slider>
                {selectedSongUrl && <Reproductor songUrl={selectedSongUrl} />}
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
