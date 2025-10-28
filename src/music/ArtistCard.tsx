import React from 'react';
import { LastFmArtist } from '../api/types';
import { getImageUrl, getGenres } from '../api/api';

interface ArtistCardProps {
  artist: LastFmArtist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const imageUrl = getImageUrl(artist.image, 'large');
  const genres = getGenres(artist.tags);

  return (
    <a href={artist.url} className="artist-card" target="_blank" rel="noopener noreferrer">
      <div
        className={`artist-avatar ${!imageUrl ? 'default-image' : ''}`}
        style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
      ></div>
      <div className="artist-name">{artist.name}</div>
      <div className="artist-genres">{genres}</div>
    </a>
  );
}