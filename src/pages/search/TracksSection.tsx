import React from 'react';
import { getImageUrl } from '../../api/api';
import { LastFmTrack } from '../../api/types';

interface TracksSectionProps {
  tracks: LastFmTrack[];
  isLoading: boolean;
  hideMoreLink?: boolean;
  onMoreClick?: () => void;
}

export default function TracksSection({ 
  tracks, 
  isLoading, 
  hideMoreLink = false, 
  onMoreClick 
}: TracksSectionProps) {
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

  /**
   * Обрабатывает клик по кнопке воспроизведения
   * @param {React.MouseEvent} e - Событие мыши
   */
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = (e.currentTarget as HTMLElement).closest('a');
      if (link) {
      link.click();
  }
  };

  /**
   * Отрисовывает список треков или сообщение о состоянии загрузки/пустом результате
   * @returns {JSX.Element} Разметка контента блока треков
   */
  const renderContent = () => {
    if (isLoading) {
      return <p>Loading tracks...</p>;
    }

    if (tracks.length === 0) {
      return <p>No tracks found</p>;
    }

    return (
      <>
        <div className="tracks-list">
          {tracks.map((track, index) => {
            const imageUrl = getImageUrl(track.image, 'medium');
            
            return (
              <a
                key={`${track.mbid || track.name}-${track.artist.name}-${index}`}
                href={track.url}
                className="track-item"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Listen to ${track.name} by ${track.artist.name}`}
              >
                <button 
                  className="play-btn" 
                  onClick={handlePlayClick}
                  aria-label="Play track"
                >
                  ▶
                </button>
                <div
                  className={`track-cover ${!imageUrl ? 'default-image' : ''}`}
                  style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
                  role="img"
                  aria-label={`${track.name} album cover`}
                >
                  {!imageUrl && '♪'}
                </div>
                <div className="track-info">
                  <div className="track-title" title={track.name}>{track.name}</div>
                  <div className="track-artist" title={track.artist.name}>{track.artist.name}</div>
                </div>
              </a>
            );
          })}
        </div>
        {!hideMoreLink && (
          <div className="more-link">
            <a href="#" onClick={handleMoreClick}>
              More tracks &gt;
            </a>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="results-section" aria-labelledby="tracks-section-title">
      <h2 id="tracks-section-title" className="section-title">Tracks</h2>
      {renderContent()}
    </section>
  );
}