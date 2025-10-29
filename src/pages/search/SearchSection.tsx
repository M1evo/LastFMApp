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

  /**
   * Генерирует заголовок в зависимости от активной вкладки
   * @returns {string} Текст заголовка
   */
  const getHeadingText = useCallback((): string => {
    if (!query) return 'Search for music';
    
    const tabNames: Record<SearchTab, string> = {
      top: 'Search results',
      artists: 'Artists',
      albums: 'Albums',
      tracks: 'Tracks'
    };
    
    return `${tabNames[activeTab]} for "${query}"`;
  }, [query, activeTab]);

  return (
    <div className="search-header">
      <h1 className="search-heading">{getHeadingText()}</h1>

      <div className="search-tabs" role="tablist">
        {(['top', 'artists', 'albums', 'tracks'] as SearchTab[]).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`search-tab ${activeTab === tab ? 'search-tab-active' : ''}`}
            onClick={(e) => handleTabClick(tab, e)}
          >
            {tab === 'top' ? 'Top Results' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
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