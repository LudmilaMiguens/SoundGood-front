import React, { useState } from "react";
import "./Biblioteca.css";
import { Nav } from '../Nav/Nav';
import { useFavorites } from '../Biblioteca/FavoritesContext';
import '../Inicio/card.css';
import Reproductor from '../Reproductor musica/ReproductorBuscador';
import Footer from '../Footer/Footer';
import { SongCard } from '../Inicio/Card';
import { usePlayer } from '../Reproductor musica/PlayerContext'; // Importa el contexto del reproductor

export function Biblioteca() {
    const { favorites, playlists, createPlaylist } = useFavorites(); // Usa el contexto de favoritos
    const [selectedSong, setSelectedSong] = useState(null); // Canción seleccionada actualmente.
    const [playlistName, setPlaylistName] = useState(''); // Nombre de la nueva lista de reproducción que se está creando.
    const [showModal, setShowModal] = useState(false); // Booleano para mostrar u ocultar el modal de creación de listas de reproducción.
    const [selectedPlaylist, setSelectedPlaylist] = useState(null); // Lista de reproducción seleccionada actualmente.

    const { setCurrentSong } = usePlayer(); // Utiliza el contexto del reproductor

    const handleCreatePlaylist = () => {
        if (playlistName.trim()) {
            createPlaylist(playlistName.trim(), []); // Inicializa una lista vacía
            setPlaylistName('');
            setShowModal(false);
        }
    };

    const handleSongClick = (song) => {
        if (song && song.url) {
            setSelectedSong(song); // Guarda la canción seleccionada localmente
            setCurrentSong(song.url); // Actualiza la canción en el reproductor global
            console.log("Canción seleccionada:", song);
        } else {
            console.error('La canción seleccionada no tiene una URL válida', song);
        }
    };


    return (
        <>
            <div>
                <Nav />
            </div>
            <div className="biblioteca">
                <div class="flex justify-center">
                    <button className="create-playlist-button" onClick={() => setShowModal(true)}>Crear Playlist</button>
                </div>
                <p className="section-title">Tus favoritos</p>
                {/* Muestra las canciones favoritas */}
                <div className="favorites-list">
                    {favorites.map((song, index) => (
                        <div key={index} className="favorite-item" onClick={() => handleSongClick(song)}>
                            <p>{song.title}</p>
                        </div>
                    ))}
                </div>
                <p className="section-title">Tus Playlists</p>
                {/* Muestra las listas de reproducción */}

                {Object.keys(playlists).map((name, index) => (
                    <div key={index}>
                        <h3 className="playlist-title" onClick={() => setSelectedPlaylist(name)}>{name}</h3>
                        {selectedPlaylist === name && (
                            <div className="playlist-list">
                                {playlists[name].map((song, songIndex) => (
                                    <div key={songIndex} className="playlist-item" onClick={() => handleSongClick(song)}>
                                        <p>{songIndex + 1}. {song.title}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {showModal && (
                    <div className="modal-playlist">
                        <div className="modal-content-playlist">
                            <h3>Crear Nueva Playlist</h3>
                            <input
                                type="text"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                placeholder="Nombre de la Playlist"
                            />
                            <button onClick={handleCreatePlaylist}>Crear</button>
                            <button onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                )}

                {selectedSong && (
                    <div className="card-playlist">
                        <SongCard
                            url={selectedSong.url}
                            title={selectedSong.title}
                            tags={selectedSong.tags}
                            image={selectedSong.image}
                            artist={selectedSong.artist}
                        />
                        <div>
                            <Reproductor /> {/* No es necesario pasar songUrl aquí */}
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </>
    );
}
