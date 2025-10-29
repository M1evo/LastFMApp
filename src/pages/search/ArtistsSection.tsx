import React from 'react';
import { LastFmArtist } from '../../api/types';
import { getImageUrl } from '../../api/api';

interface ArtistsSectionProps {
  artists: LastFmArtist[];
  isLoading: boolean;
  hideMoreLink?: boolean;
  onMoreClick?: () => void;
}

export default function ArtistsSection({ 
  artists, 
  isLoading, 
  hideMoreLink = false, 
  onMoreClick 
}: ArtistsSectionProps) {
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

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading artists...</p>;
    }

    if (artists.length === 0) {
      return <p>No artists found</p>;
    }

    return (
      <>
        <div className="artists-grid">
          {artists.map((artist, index) => {
            const imageUrl = getImageUrl(artist.image, 'large');
            const listeners = artist.listeners
              ? `${parseInt(artist.listeners).toLocaleString()} listeners`
              : '';

            return (
              <a
                key={`${artist.mbid || artist.name}-${index}`}
                href={artist.url}
                className="artist-card"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${artist.name} on Last.fm`}
              >
                <div
                  className={`artist-avatar ${!imageUrl ? 'default-image' : ''}`}
                  style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
                  role="img"
                  aria-label={`${artist.name} profile picture`}
                >
                  {!imageUrl && '♪'}
                </div>
                <div className="artist-name" title={artist.name}>{artist.name}</div>
                {listeners && <div className="artist-info">{listeners}</div>}
              </a>
            );
          })}
        </div>
        {!hideMoreLink && (
          <div className="more-link">
            <a href="#" onClick={handleMoreClick}>
              More artists &gt;
            </a>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="results-section" aria-labelledby="artists-section-title">
      <h2 id="artists-section-title" className="section-title">Artists</h2>
      {renderContent()}
    </section>
  );
}