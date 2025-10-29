/**
 * Конфигурация API Last.fm
 */
const API_CONFIG = {
  API_KEY: '91e4497c7ee6e5c159aaaa1385347e5e',
  BASE_URL: 'https://ws.audioscrobbler.com/2.0/'
};

/**
 * Текущее состояние поиска
 */
const searchState = {
  currentQuery: '',
  currentTab: 'top',
  isLoading: false
};

/**
 * Выполняет HTTP запрос к API Last.fm
 * @param {string} method - Метод API для вызова
 * @param {Object} params - Дополнительные параметры запроса
 * @returns {Promise<Object>} Промис с данными от API
 * @throws {Error} В случае ошибки сети или API
 */
async function fetchFromLastFm(method, params = {}) {
  const url = new URL(API_CONFIG.BASE_URL);
  url.searchParams.append('method', method);
  url.searchParams.append('api_key', API_CONFIG.API_KEY);
  url.searchParams.append('format', 'json');

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      url.searchParams.append(key, params[key]);
    }
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error('Network response was not ok. Status: ' + response.status);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || 'API returned an error');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Извлекает URL изображения нужного размера
 * @param {Array} images - Массив изображений от API
 * @param {string} size - Желаемый размер
 * @returns {string|null} URL изображения или null
 */
function getImageUrl(images, size = 'large') {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const sizeMap = {
    'small': 0,
    'medium': 1,
    'large': 2,
    'extralarge': 3,
    'mega': 4
  };

  const index = sizeMap[size] || 2;
  
  if (index >= images.length) {
    return images[images.length - 1]?.['#text'] || null;
  }

  const image = images[index];
  return image && image['#text'] ? image['#text'] : null;
}

/**
 * Экранирует HTML символы
 * @param {string} text - Текст для экранирования
 * @returns {string} Экранированный текст
 */
function escapeHtml(text) {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Выполняет поиск артистов
 * @param {string} query - Поисковый запрос
 * @param {number} limit - Максимальное количество результатов
 * @returns {Promise<Array>} Промис с массивом артистов
 */
async function searchArtists(query, limit = 10) {
  try {
    const data = await fetchFromLastFm('artist.search', {
      artist: query,
      limit: limit.toString()
    });

    if (!data.results || !data.results.artistmatches) {
      return [];
    }

    const artists = data.results.artistmatches.artist;
    
    if (!artists) {
      return [];
    }

    return Array.isArray(artists) ? artists : [artists];
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
}

/**
 * Выполняет поиск альбомов
 * @param {string} query - Поисковый запрос
 * @param {number} limit - Максимальное количество результатов
 * @returns {Promise<Array>} Промис с массивом альбомов
 */
async function searchAlbums(query, limit = 10) {
  try {
    const data = await fetchFromLastFm('album.search', {
      album: query,
      limit: limit.toString()
    });

    if (!data.results || !data.results.albummatches) {
      return [];
    }

    const albums = data.results.albummatches.album;
    
    if (!albums) {
      return [];
    }

    return Array.isArray(albums) ? albums : [albums];
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
}

/**
 * Выполняет поиск треков
 * @param {string} query - Поисковый запрос
 * @param {number} limit - Максимальное количество результатов
 * @returns {Promise<Array>} Промис с массивом треков
 */
async function searchTracks(query, limit = 10) {
  try {
    const data = await fetchFromLastFm('track.search', {
      track: query,
      limit: limit.toString()
    });

    if (!data.results || !data.results.trackmatches) {
      return [];
    }

    const tracks = data.results.trackmatches.track;
    
    if (!tracks) {
      return [];
    }

    return Array.isArray(tracks) ? tracks : [tracks];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}

/**
 * Создает HTML для карточки артиста в результатах поиска
 * @param {Object} artist - Объект артиста
 * @returns {string} HTML строка
 */
function createSearchArtistHTML(artist) {
  const imageUrl = getImageUrl(artist.image, 'large');
  const imageStyle = imageUrl 
    ? 'background-image: url(\'' + imageUrl + '\');' 
    : 'background-color: #666;';
  
  const listeners = artist.listeners 
    ? parseInt(artist.listeners).toLocaleString() + ' listeners'
    : '';

  return '<a href="' + artist.url + '" class="result-artist-card" target="_blank" rel="noopener noreferrer">' +
    '<div class="result-artist-image" style="' + imageStyle + '"></div>' +
    '<div class="result-artist-name">' + escapeHtml(artist.name) + '</div>' +
    '<div class="result-artist-info">' + escapeHtml(listeners) + '</div>' +
    '</a>';
}

/**
 * Создает HTML для карточки альбома
 * @param {Object} album - Объект альбома
 * @returns {string} HTML строка
 */
function createSearchAlbumHTML(album) {
  const imageUrl = getImageUrl(album.image, 'large');
  const imageStyle = imageUrl 
    ? 'background-image: url(\'' + imageUrl + '\');' 
    : 'background-color: #666;';

  return '<a href="' + album.url + '" class="result-album-card" target="_blank" rel="noopener noreferrer">' +
    '<div class="result-album-cover" style="' + imageStyle + '"></div>' +
    '<div class="result-album-details">' +
      '<div class="result-album-title">' + escapeHtml(album.name) + '</div>' +
      '<div class="result-album-artist">' + escapeHtml(album.artist) + '</div>' +
    '</div>' +
    '</a>';
}

/**
 * Создает HTML для трека в результатах поиска
 * @param {Object} track - Объект трека
 * @returns {string} HTML строка
 */
function createSearchTrackHTML(track) {
  const imageUrl = getImageUrl(track.image, 'medium');
  const imageStyle = imageUrl 
    ? 'background-image: url(\'' + imageUrl + '\');' 
    : 'background-color: #666;';

  return '<a href="' + track.url + '" class="result-track-item" target="_blank" rel="noopener noreferrer">' +
    '<button class="track-play-btn">▶</button>' +
    '<div class="result-track-cover" style="' + imageStyle + '"></div>' +
    '<div class="result-track-details">' +
      '<div class="result-track-title">' + escapeHtml(track.name) + '</div>' +
      '<div class="result-track-artist">' + escapeHtml(track.artist) + '</div>' +
    '</div>' +
    '</a>';
}

/**
 * Отображает результаты поиска для конкретной секции
 * @param {string} sectionId - ID секции результатов
 * @param {Array} items - Массив результатов
 * @param {Function} createHTML - Функция создания HTML для элемента
 * @param {string} emptyMessage - Сообщение при отсутствии результатов
 */
function displayResults(sectionId, items, createHTML, emptyMessage) {
  const container = document.getElementById(sectionId);
  
  if (!container) {
    console.error('Container not found:', sectionId);
    return;
  }

  if (items.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">' + 
      escapeHtml(emptyMessage) + '</p>';
    return;
  }

  const html = items.map(createHTML).join('');
  container.innerHTML = html;
}

/**
 * Отображает сообщение о загрузке
 * @param {string} containerId - ID контейнера
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<p style="text-align: center; padding: 20px;">Loading...</p>';
  }
}

/**
 * Обновляет заголовок страницы в зависимости от запроса и вкладки
 * @param {string} query - Поисковый запрос
 * @param {string} tab - Активная вкладка
 */
function updatePageTitle(query, tab) {
  const heading = document.querySelector('.search-heading');
  
  if (!heading) return;

  if (!query) {
    heading.textContent = 'Search for music';
    return;
  }

  const titles = {
    'top': 'Search results for "' + query + '"',
    'artists': 'Artists for "' + query + '"',
    'albums': 'Albums for "' + query + '"',
    'tracks': 'Tracks for "' + query + '"'
  };

  heading.textContent = titles[tab] || titles['top'];
}

/**
 * Выполняет поиск по всем категориям или конкретной вкладке
 * @param {string} query - Поисковый запрос
 * @param {string} tab - Активная вкладка
 */
async function performSearch(query, tab) {
  if (!query || !query.trim()) {
    return;
  }

  query = query.trim();
  searchState.currentQuery = query;
  searchState.currentTab = tab;
  searchState.isLoading = true;

  updatePageTitle(query, tab);
  updateURL(query, tab);

  try {
    if (tab === 'top') {
      showLoading('artists-results');
      showLoading('albums-results');
      showLoading('tracks-results');

      const [artists, albums, tracks] = await Promise.all([
        searchArtists(query, 12),
        searchAlbums(query, 10),
        searchTracks(query, 10)
      ]);

      displayResults('artists-results', artists, createSearchArtistHTML, 'No artists found');
      displayResults('albums-results', albums, createSearchAlbumHTML, 'No albums found');
      displayResults('tracks-results', tracks, createSearchTrackHTML, 'No tracks found');

      showAllSections();
    } else if (tab === 'artists') {
      hideAllSectionsExcept('artists-section');
      showLoading('artists-results');
      
      const artists = await searchArtists(query, 18);
      displayResults('artists-results', artists, createSearchArtistHTML, 'No artists found');
    } else if (tab === 'albums') {
      hideAllSectionsExcept('albums-section');
      showLoading('albums-results');
      
      const albums = await searchAlbums(query, 20);
      displayResults('albums-results', albums, createSearchAlbumHTML, 'No albums found');
    } else if (tab === 'tracks') {
      hideAllSectionsExcept('tracks-section');
      showLoading('tracks-results');
      
      const tracks = await searchTracks(query, 30);
      displayResults('tracks-results', tracks, createSearchTrackHTML, 'No tracks found');
    }
  } catch (error) {
    console.error('Search error:', error);
    alert('Error loading results. Please try again later.');
  } finally {
    searchState.isLoading = false;
  }
}

/**
 * Обновляет URL с параметрами поиска
 * @param {string} query - Поисковый запрос
 * @param {string} tab - Активная вкладка
 */
function updateURL(query, tab) {
  const url = new URL(window.location.href);
  url.searchParams.set('q', query);
  url.searchParams.set('tab', tab);
  window.history.pushState({}, '', url);
}

/**
 * Показывает все секции результатов
 */
function showAllSections() {
  const sections = ['artists-section', 'albums-section', 'tracks-section'];
  sections.forEach(function(id) {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = 'block';
    }
  });
}

/**
 * Скрывает все секции кроме указанной
 * @param {string} exceptId - ID секции, которую нужно оставить видимой
 */
function hideAllSectionsExcept(exceptId) {
  const sections = ['artists-section', 'albums-section', 'tracks-section'];
  sections.forEach(function(id) {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = id === exceptId ? 'block' : 'none';
    }
  });
}

/**
 * Обрабатывает переключение вкладок
 * @param {string} tab - Новая активная вкладка
 */
function handleTabChange(tab) {
  searchState.currentTab = tab;

  const tabs = document.querySelectorAll('.search-tab');
  tabs.forEach(function(tabElement) {
    tabElement.classList.remove('search-tab-active');
  });

  const activeTab = document.querySelector('.search-tab[data-tab="' + tab + '"]');
  if (activeTab) {
    activeTab.classList.add('search-tab-active');
  }

  if (searchState.currentQuery) {
    performSearch(searchState.currentQuery, tab);
  }
}

/**
 * Обрабатывает отправку формы поиска
 */
function handleSearchSubmit() {
  const input = document.querySelector('.search-input');
  
  if (!input) return;

  const query = input.value.trim();
  
  if (query) {
    performSearch(query, searchState.currentTab);
  }
}

/**
 * Обрабатывает очистку поля поиска
 */
function handleSearchClear() {
  const input = document.querySelector('.search-input');
  
  if (input) {
    input.value = '';
    input.focus();
  }
}

/**
 * Инициализирует обработчики событий
 */
function initializeEventListeners() {
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-submit-btn');
  const clearBtn = document.querySelector('.search-clear-btn');
  const tabs = document.querySelectorAll('.search-tab');

  if (searchInput) {
    searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        handleSearchSubmit();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearchSubmit);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', handleSearchClear);
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function(event) {
      event.preventDefault();
      const tabName = this.getAttribute('data-tab');
      handleTabChange(tabName);
    });
  });
}

/**
 * Инициализирует страницу при загрузке
 */
function initializePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get('q');
  const urlTab = urlParams.get('tab') || 'top';

  if (urlTab && ['top', 'artists', 'albums', 'tracks'].indexOf(urlTab) !== -1) {
    searchState.currentTab = urlTab;
    handleTabChange(urlTab);
  }

  if (urlQuery) {
    const input = document.querySelector('.search-input');
    if (input) {
      input.value = urlQuery;
    }
    performSearch(urlQuery, urlTab);
  }

  initializeEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}