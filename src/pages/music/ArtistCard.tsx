import React from 'react';
import { LastFmArtist } from '../../api/types';
import { getImageUrl } from '../../api/api';

interface ArtistCardProps {
  /** Объект артиста с данными от Last.fm API */
  artist: LastFmArtist;
}

/**
 * Карточка артиста с изображением, именем и количеством слушателей
 * @param {ArtistCardProps} props Свойства компонента
 * @returns {JSX.Element} Карточка артиста
 */
export default function ArtistCard({ artist }: ArtistCardProps): JSX.Element {
  const imageUrl = getImageUrl(artist.image, 'large');
  const listenersCount = artist.listeners 
    ? `${parseInt(artist.listeners).toLocaleString()} listeners` 
    : '';

  return (
    <a 
      href={artist.url} 
      className="artist-card" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={`View ${artist.name} on Last.fm`}
    >
      <div
        className={`artist-image ${!imageUrl ? 'default-image' : ''}`}
        style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
        role="img"
        aria-label={`${artist.name} profile picture`}
      >
        {!imageUrl && <span className="placeholder-text">No Image</span>}
      </div>
      <h3 className="artist-name">{artist.name}</h3>
      {listenersCount && (
        <p className="artist-genre">{listenersCount}</p>
      )}
    </a>
  );
}