import React from 'react';
import { getImageUrl } from '../api/api';
import { LastFmTrack } from '../api/types';

interface TracksSectionProps {
  tracks: LastFmTrack[];
  isLoading: boolean;
  hideMoreLink?: boolean;
  onMoreClick?: () => void;
}

export default function TracksSection({ tracks, isLoading, hideMoreLink = false, onMoreClick }: TracksSectionProps) {
  const renderTracks = () => {
    if (isLoading) {
      return <p style={{ textAlign: 'center' }}>Loading tracks...</p>;
    }

    if (tracks.length === 0) {
      return <p style={{ textAlign: 'center', color: '#666' }}>No tracks found</p>;
    }

    return (
      <div className="tracks-list">
        {tracks.map((track, index) => {
          const imageUrl = getImageUrl(track.image, 'medium');
          return (
            <a
              key={`${track.name}-${track.artist.name}-${index}`}
              href={track.url}
              className="track-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="play-btn">▶</button>
              <div
                className={`track-cover ${!imageUrl ? 'default-image' : ''}`}
                style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
              ></div>
              <div className="track-info">
                <div className="track-title">{track.name}</div>
                <div className="track-artist">{track.artist.name}</div>
              </div>
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
      <h2 className="section-title">Tracks</h2>
      {renderTracks()}
      {tracks.length > 0 && !isLoading && !hideMoreLink && (
        <div className="more-link">
          <a href="#" onClick={handleMoreClick}>
            More tracks &gt;
          </a>
        </div>
      )}
    </section>
  );
}