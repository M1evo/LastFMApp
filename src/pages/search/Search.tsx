import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import './search.css';
import { LastFmAlbum, LastFmArtist, LastFmTrack } from '../../api/types';
import { searchAlbums, searchArtists, searchTracks } from '../../api/api';
import SearchSection from './SearchSection';
import ArtistsSection from './ArtistsSection';
import AlbumsSection from './AlbumsSection';
import TracksSection from './TracksSection';
import ErrorMessage from '../../components/ErrorMessage';

/** Типы доступных вкладок поиска */
export type SearchTab = 'top' | 'artists' | 'albums' | 'tracks';

/**
 * Страница поиска с поддержкой различных категорий контента
 * Управляет состоянием поиска через URL параметры
 * @returns {JSX.Element} Страница поиска
 */
export default function Search(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<SearchTab>(
    (searchParams.get('tab') as SearchTab) || 'top'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [artists, setArtists] = useState<LastFmArtist[]>([]);
  const [albums, setAlbums] = useState<LastFmAlbum[]>([]);
  const [tracks, setTracks] = useState<LastFmTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Выполняет поиск по указанному запросу и вкладке
   * Обновляет URL и загружает данные с обработкой ошибок
   * @param {string} searchQuery Поисковый запрос
   * @param {SearchTab} tab Активная вкладка для поиска
   */
  const performSearch = useCallback(async (
    searchQuery: string,
    tab: SearchTab = activeTab
  ) => {
    if (!searchQuery.trim()) {
      return;
    }

    const trimmedQuery = searchQuery.trim();
    setQuery(trimmedQuery);
    setIsLoading(true);
    setError(null);

    // Обновление URL
    const params = new URLSearchParams();
    params.set('q', trimmedQuery);
    params.set('tab', tab);
    setSearchParams(params);

    try {
      if (tab === 'top') {
        // Параллельная загрузка всех категорий
        const [artistsData, albumsData, tracksData] = await Promise.all([
          searchArtists(trimmedQuery, 12),
          searchAlbums(trimmedQuery, 10),
          searchTracks(trimmedQuery, 10)
        ]);

        setArtists(artistsData);
        setAlbums(albumsData);
        setTracks(tracksData);
      } else if (tab === 'artists') {
        const artistsData = await searchArtists(trimmedQuery, 20);
        setArtists(artistsData);
        setAlbums([]);
        setTracks([]);
      } else if (tab === 'albums') {
        const albumsData = await searchAlbums(trimmedQuery, 20);
        setAlbums(albumsData);
        setArtists([]);
        setTracks([]);
      } else if (tab === 'tracks') {
        const tracksData = await searchTracks(trimmedQuery, 30);
        setTracks(tracksData);
        setArtists([]);
        setAlbums([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Search failed';
      
      console.error('Search error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, setSearchParams]);

  /**
   * Обрабатывает переключение между вкладками
   * @param {SearchTab} tab Новая активная вкладка
   */
  const handleTabChange = useCallback((tab: SearchTab) => {
    setActiveTab(tab);
    if (query) {
      performSearch(query, tab);
    }
  }, [query, performSearch]);

  /**
   * Обрабатывает клик по ссылке "Показать больше"
   * @param {'artists' | 'albums' | 'tracks'} section Секция для расширения
   */
  const handleShowMore = useCallback((
    section: 'artists' | 'albums' | 'tracks'
  ) => {
    handleTabChange(section);
  }, [handleTabChange]);

  /**
   * Повторяет последний поиск при ошибке
   */
  const handleRetry = useCallback(() => {
    if (query) {
      performSearch(query, activeTab);
    }
  }, [query, activeTab, performSearch]);

  // Инициализация поиска из URL при монтировании
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlTab = searchParams.get('tab') as SearchTab;

    if (urlTab && ['top', 'artists', 'albums', 'tracks'].includes(urlTab)) {
      setActiveTab(urlTab);
    }

    if (urlQuery && urlQuery !== query) {
      performSearch(urlQuery, urlTab || 'top');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Рендерит результаты в зависимости от активной вкладки
   * @returns {JSX.Element} Секции с результатами
   */
  const renderResults = (): JSX.Element => {
    if (error) {
      return (
        <ErrorMessage 
          message={error}
          hint="Unable to complete search. Please try again."
          onRetry={handleRetry}
        />
      );
    }

    switch (activeTab) {
      case 'artists':
        return (
          <ArtistsSection 
            artists={artists} 
            isLoading={isLoading} 
            hideMoreLink 
          />
        );
      case 'albums':
        return (
          <AlbumsSection 
            albums={albums} 
            isLoading={isLoading} 
            hideMoreLink 
          />
        );
      case 'tracks':
        return (
          <TracksSection 
            tracks={tracks} 
            isLoading={isLoading} 
            hideMoreLink 
          />
        );
      default:
        return (
          <>
            <ArtistsSection
              artists={artists}
              isLoading={isLoading}
              onMoreClick={() => handleShowMore('artists')}
            />
            <AlbumsSection
              albums={albums}
              isLoading={isLoading}
              onMoreClick={() => handleShowMore('albums')}
            />
            <TracksSection
              tracks={tracks}
              isLoading={isLoading}
              onMoreClick={() => handleShowMore('tracks')}
            />
          </>
        );
    }
  };

  return (
    <div className="page-container">
      <SearchSection
        query={query}
        activeTab={activeTab}
        onSearch={performSearch}
        onTabChange={handleTabChange}
      />
      <div className="search-results">
        {renderResults()}
      </div>
    </div>
  );
}