import React from 'react';
import { LastFmAlbum } from '../api/types';
import { getImageUrl } from '../api/api';

interface AlbumsSectionProps {
  albums: LastFmAlbum[];
  isLoading: boolean;
  hideMoreLink?: boolean;
  onMoreClick?: () => void;
}

export default function AlbumsSection({ albums, isLoading, hideMoreLink = false, onMoreClick }: AlbumsSectionProps) {
  const renderAlbums = () => {
    if (isLoading) {
      return <p style={{ textAlign: 'center' }}>Loading albums...</p>;
    }

    if (albums.length === 0) {
      return <p style={{ textAlign: 'center', color: '#666' }}>No albums found</p>;
    }

    return (
      <div className="albums-grid">
        {albums.map((album, index) => {
          const imageUrl = getImageUrl(album.image, 'large');

          return (
            <a
              key={`${album.name}-${album.artist}-${index}`}
              href={album.url}
              className="album-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className={`album-cover ${!imageUrl ? 'default-image' : ''}`}
                style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : {}}
              ></div>
              <div className="album-info">
                <div className="album-title">{album.name}</div>
                <div className="album-artist">{album.artist}</div>
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
      <h2 className="section-title">Albums</h2>
      {renderAlbums()}
      {albums.length > 0 && !isLoading && !hideMoreLink && (
        <div className="more-link">
          <a href="#" onClick={handleMoreClick}>
            More albums &gt;
          </a>
        </div>
      )}
    </section>
  );
}