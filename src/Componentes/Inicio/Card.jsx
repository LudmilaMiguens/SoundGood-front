import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import './card.css';

export function SongCard({ url, title, tags= [], onClick, image, artist, onFavorite, onAddToPlaylist }) {
    const [isFavorite, setIsFavorite] = useState(false);  // Estado para controlar si la canción es favorita

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        onFavorite();
    };


    return (
        <div className="song-card" onClick={onClick}>
            <div className="image-container">
                <img src={image} alt={artist} className="artist-image" />
            </div>
            <h3 className="song-title">{title}</h3>
            <p className="song-tags">{Array.isArray(tags) ? tags.join(', ') : ''}</p>
            <div className="button-container">
                <button
                    className="favorite-button"
                    onClick={handleFavoriteClick}
                >
                    <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'text-red-500' : 'text-white'} />
                </button>
                <button
                    className="add-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToPlaylist();
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
        </div>
    );
}