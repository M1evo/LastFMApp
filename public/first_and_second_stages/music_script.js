/**
 * Конфигурация API Last.fm
 */
const API_CONFIG = {
  API_KEY: '91e4497c7ee6e5c159aaaa1385347e5e',
  BASE_URL: 'https://ws.audioscrobbler.com/2.0/',
  DEFAULT_ARTIST_LIMIT: 12,
  DEFAULT_TRACK_LIMIT: 18
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
 * Извлекает URL изображения нужного размера из массива изображений Last.fm
 * @param {Array} images - Массив изображений от API
 * @param {string} size - Желаемый размер изображения
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
 * Форматирует теги в строку жанров
 * @param {Object} tags - Объект тегов от API
 * @returns {string} Строка с жанрами
 */
function formatGenres(tags) {
  if (!tags || !tags.tag || !Array.isArray(tags.tag)) {
    return '';
  }

  return tags.tag
    .slice(0, 3)
    .map(function(tag) { return tag.name; })
    .join('\u00a0\u00b7\u00a0');
}

/**
 * Получает список топовых артистов с их тегами
 * @param {number} limit - Количество артистов для получения
 * @returns {Promise<Array>} Промис с массивом артистов
 */
async function getTopArtists(limit = API_CONFIG.DEFAULT_ARTIST_LIMIT) {
  try {
    const data = await fetchFromLastFm('chart.gettopartists', {
      limit: limit.toString()
    });

    if (!data.artists || !data.artists.artist) {
      throw new Error('No artists data received');
    }

    const artists = data.artists.artist;
    
    const artistsWithTags = await Promise.all(
      artists.map(async function(artist) {
        try {
          const tagsData = await fetchFromLastFm('artist.gettoptags', {
            artist: artist.name,
            limit: '3'
          });
          artist.tags = tagsData.toptags;
        } catch (error) {
          console.warn('Failed to fetch tags for ' + artist.name + ':', error);
          artist.tags = null;
        }
        return artist;
      })
    );

    return artistsWithTags;
  } catch (error) {
    console.error('Error loading artists:', error);
    throw error;
  }
}

/**
 * Получает список топовых треков с их тегами
 * @param {number} limit - Количество треков для получения
 * @returns {Promise<Array>} Промис с массивом треков
 */
async function getTopTracks(limit = API_CONFIG.DEFAULT_TRACK_LIMIT) {
  try {
    const data = await fetchFromLastFm('chart.gettoptracks', {
      limit: limit.toString()
    });

    if (!data.tracks || !data.tracks.track) {
      throw new Error('No tracks data received');
    }

    const tracks = data.tracks.track;
    
    const tracksWithTags = await Promise.all(
      tracks.map(async function(track) {
        try {
          const tagsData = await fetchFromLastFm('track.gettoptags', {
            track: track.name,
            artist: track.artist.name,
            limit: '3'
          });
          track.tags = tagsData.toptags;
        } catch (error) {
          console.warn('Failed to fetch tags for ' + track.name + ':', error);
          track.tags = null;
        }
        return track;
      })
    );

    return tracksWithTags;
  } catch (error) {
    console.error('Error loading tracks:', error);
    throw error;
  }
}

/**
 * Создает HTML для карточки артиста
 * @param {Object} artist - Объект артиста от API
 * @returns {string} HTML строка
 */
function createArtistCardHTML(artist) {
  const imageUrl = getImageUrl(artist.image, 'large');
  const genres = formatGenres(artist.tags);
  
  const imageStyle = imageUrl 
    ? 'background-image: url(\'' + imageUrl + '\');' 
    : 'background-color: #666;';

  return '<a href="' + artist.url + '" class="artist-card" target="_blank" rel="noopener noreferrer">' +
    '<div class="artist-image" style="' + imageStyle + '"></div>' +
    '<div class="artist-name">' + escapeHtml(artist.name) + '</div>' +
    '<div class="artist-genre">' + escapeHtml(genres) + '</div>' +
    '</a>';
}

/**
 * Создает HTML для трека
 * @param {Object} track - Объект трека от API
 * @returns {string} HTML строка
 */
function createTrackItemHTML(track) {
  const imageUrl = getImageUrl(track.image, 'medium');
  const genres = formatGenres(track.tags);
  
  const imageStyle = imageUrl 
    ? 'background-image: url(\'' + imageUrl + '\');' 
    : 'background-color: #666;';

  return '<a href="' + track.url + '" class="track-item" target="_blank" rel="noopener noreferrer">' +
    '<div class="track-cover" style="' + imageStyle + '"></div>' +
    '<div class="track-details">' +
      '<div class="track-title">' + escapeHtml(track.name) + '</div>' +
      '<div class="track-artist">' + escapeHtml(track.artist.name) + '</div>' +
      '<div class="track-genre">' + escapeHtml(genres) + '</div>' +
    '</div>' +
    '</a>';
}

/**
 * Экранирует HTML символы для предотвращения XSS
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
 * Отображает сообщение об ошибке пользователю
 * @param {HTMLElement} container - Контейнер для сообщения
 * @param {string} message - Текст сообщения об ошибке
 */
function showError(container, message) {
  container.innerHTML = '<div style="text-align: center; padding: 40px; color: #d51007;">' +
    '<p style="font-size: 18px; margin-bottom: 10px;">⚠️ ' + escapeHtml(message) + '</p>' +
    '<p style="font-size: 14px; color: #666;">Please try refreshing the page or check your internet connection.</p>' +
    '</div>';
}

/**
 * Отображает индикатор загрузки
 * @param {HTMLElement} container - Контейнер для индикатора
 */
function showLoading(container) {
  container.innerHTML = '<div style="text-align: center; padding: 40px;">' +
    '<p style="font-size: 16px; color: #666;">Loading...</p>' +
    '</div>';
}

/**
 * Загружает и отображает топовых артистов
 */
async function loadArtists() {
  const artistsGrid = document.querySelector('.artists-grid');
  
  if (!artistsGrid) {
    console.error('Artists grid container not found');
    return;
  }

  showLoading(artistsGrid);

  try {
    const artists = await getTopArtists();
    
    const artistsHTML = artists.map(createArtistCardHTML).join('');
    artistsGrid.innerHTML = artistsHTML;
  } catch (error) {
    showError(artistsGrid, 'Failed to load artists');
  }
}

/**
 * Загружает и отображает топовые треки
 */
async function loadTracks() {
  const tracksGrid = document.querySelector('.tracks-grid');
  
  if (!tracksGrid) {
    console.error('Tracks grid container not found');
    return;
  }

  showLoading(tracksGrid);

  try {
    const tracks = await getTopTracks();
    
    const tracksHTML = tracks.map(createTrackItemHTML).join('');
    tracksGrid.innerHTML = tracksHTML;
  } catch (error) {
    showError(tracksGrid, 'Failed to load tracks');
  }
}

/**
 * Инициализирует приложение при загрузке страницы
 */
function initializePage() {
  loadArtists();
  loadTracks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}