import React from 'react';
import { LastFmArtist } from '../api/types';
import { getImageUrl } from '../api/api';

interface ArtistsSectionProps {
  artists: LastFmArtist[];
  isLoading: boolean;
  hideMoreLink?: boolean;
  onMoreClick?: () => void;
}

export default function ArtistsSection({ artists, isLoading, hideMoreLink = false, onMoreClick }: ArtistsSectionProps) {
  const renderArtists = () => {
    if (isLoading) {
      return <p style={{ textAlign: 'center' }}>Loading artists...</p>;
    }

    if (artists.length === 0) {
      return <p style={{ textAlign: 'center', color: '#666' }}>No artists found</p>;
    }

    return (
      <div className="artists-grid">
        {artists.map((artist, index) => {
          const imageUrl = getImageUrl(artist.image, 'large');
          const listeners = artist.listeners
            ? `${parseInt(artist.listeners).toLocaleString()} listeners`
            : '';

          return (
            <a
              key={`${artist.name}-${index}`}
              href={artist.url}
              className="artist-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className={`artist-avatar ${!imageUrl ? 'default-image' : ''}`}
                style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
              ></div>
              <div className="artist-name">{artist.name}</div>
              <div className="artist-info">{listeners}</div>
            </a>
          );
        })}
      </div>
    );
  };

  /**
   * Обрабатывает клик по ссылке "Показать больше"
   * @param {React.MouseEvent} e - Событие мыши
   */
  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onMoreClick) {
      onMoreClick();
    }
  };

  return (
    <section className="results-section">
      <h2 className="section-title">Artists</h2>
      {renderArtists()}
      {artists.length > 0 && !isLoading && !hideMoreLink && (
        <div className="more-link">
          <a href="#" onClick={handleMoreClick}>
            More artists &gt;
          </a>
        </div>
      )}
    </section>
  );
}