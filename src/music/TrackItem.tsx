import React from 'react';
import { getGenres, getImageUrl } from '../api/api';
import { LastFmTrack } from '../api/types';

interface TrackItemProps {
  track: LastFmTrack;
}

export default function TrackItem({ track }: TrackItemProps) {
  const imageUrl = getImageUrl(track.image, 'medium');
  const genres = getGenres(track.tags);

  return (
    <a href={track.url} className="track-item" target="_blank" rel="noopener noreferrer">
      <div
        className={`track-cover ${!imageUrl ? 'default-image' : ''}`}
        style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
      ></div>
      <div className="track-info">
        <div className="track-title">{track.name}</div>
        <div className="track-artist">{track.artist.name}</div>
        <div className="track-genres">{genres}</div>
      </div>
    </a>
  );
}