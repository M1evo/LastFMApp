import React, { useState, useEffect, useCallback } from 'react';
import { SearchTab } from './Search';

interface SearchSectionProps {
  /** Текущий поисковый запрос */
  query: string;
  /** Активная вкладка поиска */
  activeTab: SearchTab;
  /** Callback для выполнения поиска */
  onSearch: (query: string) => void;
  /** Callback для смены вкладки */
  onTabChange: (tab: SearchTab) => void;
}

/**
 * Компонент секции поиска с вкладками и полем ввода
 * @param {SearchSectionProps} props Свойства компонента
 * @returns {JSX.Element} Секция поиска
 */
export default function SearchSection({ 
  query, 
  activeTab, 
  onSearch, 
  onTabChange 
}: SearchSectionProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  /**
   * Отправляет поисковый запрос
   */
  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }, [inputValue, onSearch]);

  /**
   * Обрабатывает нажатие Enter в поле ввода
   * @param {React.KeyboardEvent<HTMLInputElement>} e Событие клавиатуры
   */
  const handleKeyPress = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  /**
   * Очищает поле ввода
   */
  const handleClear = useCallback(() => {
    setInputValue('');
  }, []);

  /**
   * Обрабатывает клик по вкладке
   * @param {SearchTab} tab Выбранная вкладка
   * @param {React.MouseEvent} e Событие мыши
   */
  const handleTabClick = useCallback((
    tab: SearchTab,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    onTabChange(tab);
  }, [onTabChange]);

  return (
    <div className="search-header">
      <h1 className="search-heading">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>

      <div className="search-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'top'}
          className={`search-tab ${activeTab === 'top' ? 'search-tab-active' : ''}`}
          onClick={(e) => handleTabClick('top', e)}
        >
          Top Results
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'artists'}
          className={`search-tab ${activeTab === 'artists' ? 'search-tab-active' : ''}`}
          onClick={(e) => handleTabClick('artists', e)}
        >
          Artists
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'albums'}
          className={`search-tab ${activeTab === 'albums' ? 'search-tab-active' : ''}`}
          onClick={(e) => handleTabClick('albums', e)}
        >
          Albums
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'tracks'}
          className={`search-tab ${activeTab === 'tracks' ? 'search-tab-active' : ''}`}
          onClick={(e) => handleTabClick('tracks', e)}
        >
          Tracks
        </button>
      </div>

      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search for artists, albums, tracks..."
          className="search-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="Search query"
        />
        {inputValue && (
          <button 
            className="search-clear-btn" 
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ×
          </button>
        )}
        <button 
          className="search-submit-btn" 
          onClick={handleSubmit}
          aria-label="Submit search"
          type="button"
          disabled={!inputValue.trim()}
        >
          🔍
        </button>
      </div>
    </div>
  );
}