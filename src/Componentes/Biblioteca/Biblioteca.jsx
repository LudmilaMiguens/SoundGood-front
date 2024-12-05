import React, { useState, } from "react";
import "./Biblioteca.css";
import { useFavorites } from '../Biblioteca/FavoritesContext';
import '../Inicio/card.css';
import ReproductorBuscador from '../Reproductor musica/ReproductorBuscador';
import { usePlayer } from '../Reproductor musica/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
const Song = {
    titulo: '',
    tags: [],
    artist: [],
    image: '',
    url: ''
};

export default function Biblioteca() {
    const { favorites, playlists, createPlaylist, removeFavorite, removeSongFromPlaylist, verificarFavorito, addFavorites, setFavorites, setSelectedSongUrl, selectedSongUrl } = useFavorites(); // Incluye métodos de eliminación
    const [selectedSong, setSelectedSong] = useState(Song); // Canción seleccionada actualmente.
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
            setSelectedSong({ ...song }); // Guarda la canción seleccionada localmente
            setCurrentSong(song.url); // Actualiza la canción en el reproductor global
            console.log("Canción seleccionada:", song);
        } else {
            console.error('La canción seleccionada no tiene una URL válida', song);
        }
    };

    const handleSongClickSong = (song) => {
        setSelectedSongUrl({
            url: `${import.meta.env.VITE_API_URL}/files/song/${song.songFilename}`,
            title: song.titulo,
            tags: song.genero?.generos || [],
        });
    };
    return (
        <div className="biblioteca">
            <div className="flex justify-center">
                <button className="create-playlist-button" onClick={() => setShowModal(true)}>Crear Playlist</button>
            </div>
            <div className="favorites-list">
                <p className="section-title">Tus favoritos</p>
                {favorites.map((song, index) => (
                    <div
                        key={index}
                        className="favorite-item"
                        onClick={() => {
                            handleSongClickSong(song)
                            setCurrentSong(song.url);
                        }} // Llama a la función para reproducir la canción
                    >
                        <p>
                            {song.titulo}
                            {song.artistas.length > 0 && (
                                <span> - {song.artistas.map((tag, index) => (
                                    <span key={index}>
                                        {tag.nombre}{index < song.artistas.length - 1 && ', '}
                                    </span>
                                ))}</span>
                            )}
                        </p>
                        {/* Solo muestra el título */}
                        <button
                            className="remove-button"
                            onClick={(e) => {
                                e.stopPropagation(); // Evita que el botón active la reproducción
                                removeFavorite(song); // Elimina la canción de favoritos
                            }}
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
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
                                    <p>{songIndex + 1}. {song.titulo}</p>
                                    <button
                                        className="remove-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSongFromPlaylist(name, song); // Llama a la función de eliminar canciones de la playlist
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
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


            {selectedSongUrl.url &&
                <ReproductorBuscador
                    songUrl={selectedSongUrl.url}
                    title={selectedSongUrl.title}
                    tags={selectedSongUrl.tags} />}
        </div>
    );
}
