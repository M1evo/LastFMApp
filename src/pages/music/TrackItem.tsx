import React from 'react';
import { getImageUrl } from '../../api/api';
import { LastFmTrack } from '../../api/types';

interface TrackItemProps {
  /** Объект трека с данными от Last.fm API */
  track: LastFmTrack;
}

/**
 * Элемент списка треков с обложкой, названием, артистом и статистикой
 * @param {TrackItemProps} props Свойства компонента
 * @returns {JSX.Element} Элемент трека
 */
export default function TrackItem({ track }: TrackItemProps): JSX.Element {
  const imageUrl = getImageUrl(track.image, 'medium');
  const playCount = track.playcount 
    ? `${parseInt(track.playcount).toLocaleString()} plays` 
    : '';

  return (
    <a 
      href={track.url} 
      className="track-item" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={`Listen to ${track.name} by ${track.artist.name}`}
    >
      <div
        className={`track-cover ${!imageUrl ? 'default-image' : ''}`}
        style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
        role="img"
        aria-label={`${track.name} album cover`}
      >
        {!imageUrl && <span className="placeholder-text">♪</span>}
      </div>
      <div className="track-details">
        <h3 className="track-title">{track.name}</h3>
        <p className="track-artist">{track.artist.name}</p>
        {playCount && (
          <p className="track-genre">{playCount}</p>
        )}
      </div>
    </a>
  );
}