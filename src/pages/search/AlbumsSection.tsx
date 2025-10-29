import React from 'react';
import { LastFmAlbum } from '../../api/types';
import { getImageUrl } from '../../api/api';

interface AlbumsSectionProps {
  albums: LastFmAlbum[];
  isLoading: boolean;
  hideMoreLink?: boolean;
  onMoreClick?: () => void;
}

export default function AlbumsSection({ 
  albums, 
  isLoading, 
  hideMoreLink = false, 
  onMoreClick 
}: AlbumsSectionProps) {
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
      return <p>Loading albums...</p>;
    }

    if (albums.length === 0) {
      return <p>No albums found</p>;
    }

    return (
      <>
        <div className="albums-grid">
          {albums.map((album, index) => {
            const imageUrl = getImageUrl(album.image, 'large');

            return (
              <a
                key={`${album.mbid || album.name}-${album.artist}-${index}`}
                href={album.url}
                className="album-card"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${album.name} by ${album.artist}`}
              >
                <div
                  className={`album-cover ${!imageUrl ? 'default-image' : ''}`}
                  style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
                  role="img"
                  aria-label={`${album.name} album cover`}
                >
                  {!imageUrl && '♪'}
                </div>
                <div className="album-info">
                  <div className="album-title" title={album.name}>{album.name}</div>
                  <div className="album-artist" title={album.artist}>{album.artist}</div>
                </div>
              </a>
            );
          })}
        </div>
        {!hideMoreLink && (
          <div className="more-link">
            <a href="#" onClick={handleMoreClick}>
              More albums &gt;
            </a>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="results-section" aria-labelledby="albums-section-title">
      <h2 id="albums-section-title" className="section-title">Albums</h2>
      {renderContent()}
    </section>
  );
}