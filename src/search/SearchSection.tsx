import React, { useState, useEffect } from 'react';
import { Tab } from './Search';

interface SearchSectionProps {
  query: string;
  activeTab: Tab;
  onSearch: (query: string) => void;
  onTabChange: (tab: Tab) => void;
}

export default function SearchSection({ query, activeTab, onSearch, onTabChange }: SearchSectionProps) {
  const [inputValue, setInputValue] = useState<string>(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  /**
   * Обрабатывает отправку поискового запроса
   */
  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  /**
   * Обрабатывает нажатие клавиши Enter в поле ввода
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Событие клавиатуры
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  /**
   * Очищает поле ввода
   */
  const handleClear = () => {
    setInputValue('');
  };

  /**
   * Обрабатывает клик по вкладке
   * @param {Tab} tab - Выбранная вкладка
   * @param {React.MouseEvent} e - Событие мыши
   */
  const handleTabClick = (tab: Tab, e: React.MouseEvent) => {
    e.preventDefault();
    onTabChange(tab);
  };

  /**
   * Возвращает заголовок для текущей вкладки
   * @returns {string} Текст заголовка
   */
  const getTabTitle = (): string => {
    if (!query) return 'Search for music';
    
    switch (activeTab) {
      case 'artists':
        return `Artists for "${query}"`;
      case 'albums':
        return `Albums for "${query}"`;
      case 'tracks':
        return `Tracks for "${query}"`;
      default:
        return `Search results for "${query}"`;
    }
  };

  return (
    <div className="search-section">
      <h1 className="search-title">{getTabTitle()}</h1>

      <div className="search-tabs">
        <a
          href="#"
          className={`tab ${activeTab === 'top' ? 'active' : ''}`}
          onClick={(e) => handleTabClick('top', e)}
        >
          Top Results
        </a>
        <a
          href="#"
          className={`tab ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={(e) => handleTabClick('artists', e)}
        >
          Artists
        </a>
        <a
          href="#"
          className={`tab ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={(e) => handleTabClick('albums', e)}
        >
          Albums
        </a>
        <a
          href="#"
          className={`tab ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={(e) => handleTabClick('tracks', e)}
        >
          Tracks
        </a>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for artists, albums, tracks..."
          className="search-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-clear" onClick={handleClear}></button>
        <button className="search-submit" onClick={handleSubmit}></button>
      </div>
    </div>
  );
}