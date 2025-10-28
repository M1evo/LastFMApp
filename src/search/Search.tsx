import React, { useEffect, useState } from 'react';
import './search.css';
import Header from '../Header';
import Footer from '../Footer';
import { LastFmAlbum, LastFmArtist, LastFmTrack } from '../api/types';
import { searchAlbums, searchArtists, searchTracks } from '../api/api';
import SearchSection from './SearchSection';
import ArtistsSection from './ArtistsSection';
import AlbumsSection from './AlbumsSection';
import TracksSection from './TracksSection';

export type Tab = 'top' | 'artists' | 'albums' | 'tracks';

export default function Search() {
  const [query, setQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('top');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [artists, setArtists] = useState<LastFmArtist[]>([]);
  const [albums, setAlbums] = useState<LastFmAlbum[]>([]);
  const [tracks, setTracks] = useState<LastFmTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Выполняет поиск по всем категориям или конкретной вкладке
   * @param {string} searchQuery - Поисковый запрос
   * @param {Tab} tab - Активная вкладка для поиска
   */
  const performSearch = async (searchQuery: string, tab: Tab = activeTab) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);

    try {
      if (tab === 'top') {
        const [artistsData, albumsData, tracksData] = await Promise.all([
          searchArtists(searchQuery, 12),
          searchAlbums(searchQuery, 10),
          searchTracks(searchQuery, 10)
        ]);

        setArtists(artistsData);
        setAlbums(albumsData);
        setTracks(tracksData);
      } else if (tab === 'artists') {
        const artistsData = await searchArtists(searchQuery, 18);
        setArtists(artistsData);
        setAlbums([]);
        setTracks([]);
      } else if (tab === 'albums') {
        const albumsData = await searchAlbums(searchQuery, 20);
        setAlbums(albumsData);
        setArtists([]);
        setTracks([]);
      } else if (tab === 'tracks') {
        const tracksData = await searchTracks(searchQuery, 30);
        setTracks(tracksData);
        setArtists([]);
        setAlbums([]);
      }

      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
    } catch (err) {
      console.error('Search error:', err);
      setError('Error loading results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Обрабатывает переключение между вкладками поиска
   * @param {Tab} tab - Новая активная вкладка
   */
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (query) {
      performSearch(query, tab);
    }
  };

  /**
   * Обрабатывает клик по ссылке "Показать больше"
   * @param {'artists' | 'albums' | 'tracks'} section - Секция для расширения
   */
  const handleMoreClick = (section: 'artists' | 'albums' | 'tracks') => {
    handleTabChange(section);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    const urlTab = urlParams.get('tab') as Tab;

    if (urlTab && ['top', 'artists', 'albums', 'tracks'].includes(urlTab)) {
      setActiveTab(urlTab);
    }

    if (urlQuery) {
      performSearch(urlQuery, urlTab || 'top');
    }
  }, []);

  const renderResults = () => {
    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#d51007' }}>
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case 'artists':
        return <ArtistsSection artists={artists} isLoading={isLoading} hideMoreLink={true} />;
      case 'albums':
        return <AlbumsSection albums={albums} isLoading={isLoading} hideMoreLink={true} />;
      case 'tracks':
        return <TracksSection tracks={tracks} isLoading={isLoading} hideMoreLink={true} />;
      default:
        return (
          <>
            <ArtistsSection
              artists={artists}
              isLoading={isLoading}
              onMoreClick={() => handleMoreClick('artists')}
            />
            <AlbumsSection
              albums={albums}
              isLoading={isLoading}
              onMoreClick={() => handleMoreClick('albums')}
            />
            <TracksSection
              tracks={tracks}
              isLoading={isLoading}
              onMoreClick={() => handleMoreClick('tracks')}
            />
          </>
        );
    }
  };

  return (
    <div id="root">
      <Header />
      <main className="main">
        <div className="container">
          <SearchSection
            query={query}
            activeTab={activeTab}
            onSearch={performSearch}
            onTabChange={handleTabChange}
          />
          {renderResults()}
        </div>
      </main>
      <Footer />
    </div>
  );
}