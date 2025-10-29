import {
  LastFmArtistsResponse,
  LastFmTracksResponse,
  LastFmImage,
  LastFmArtist,
  LastFmArtistSearchResponse,
  LastFmAlbum,
  LastFmAlbumSearchResponse,
  LastFmTrackSearchResponse,
  LastFmTrack
} from './types';

const API_KEY = '91e4497c7ee6e5c159aaaa1385347e5e';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Выполняет HTTP-запрос к Last.fm API с автоматической обработкой ошибок
 * @template T Тип ожидаемого ответа от API
 * @param {string} method Метод Last.fm API (например, 'chart.gettopartists')
 * @param {Record<string, string>} params Объект с параметрами запроса
 * @returns {Promise<T>} Промис, разрешающийся данными от API
 * @throws {Error} Ошибка с информативным сообщением при сбое запроса
 * @example
 * const data = await fetchLastFmData<LastFmArtistsResponse>('chart.gettopartists', { limit: '10' });
 */
export async function fetchLastFmData<T>(
  method: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.append('method', method);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('format', 'json');

  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();

    if (data.error) {
      throw new Error(`API error: ${data.message || 'Unknown API error'}`);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Last.fm API Error:', error.message);
      throw new Error(`Failed to fetch data from Last.fm: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching data');
  }
}

/**
 * Извлекает URL изображения заданного размера из массива Last.fm
 * @param {LastFmImage[]} images Массив изображений разных размеров
 * @param {'small' | 'medium' | 'large' | 'extralarge' | 'mega'} size Требуемый размер
 * @returns {string | null} URL изображения или null если не найдено
 * @example
 * const imageUrl = getImageUrl(artist.image, 'large');
 */
export function getImageUrl(
  images: LastFmImage[],
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' = 'large'
): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const sizeIndex: Record<string, number> = {
    small: 0,
    medium: 1,
    large: 2,
    extralarge: 3,
    mega: 4
  };

  const index = sizeIndex[size];
  
  if (index >= images.length) {
    const lastImage = images[images.length - 1];
    return lastImage?.['#text'] || null;
  }

  const image = images[index];
  return image?.['#text'] || null;
}

/**
 * Нормализует данные API, которые могут быть массивом или одиночным объектом
 * @template T Тип элементов данных
 * @param {T | T[] | undefined} data Данные от API
 * @returns {T[]} Всегда возвращает массив
 * @example
 * const artists = normalizeApiData(response.results.artistmatches.artist);
 */
function normalizeApiData<T>(data: T | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Получает список самых популярных артистов на данный момент
 * @param {number} limit Количество артистов для получения (по умолчанию 12)
 * @returns {Promise<LastFmArtist[]>} Массив артистов с их данными
 * @throws {Error} Если не удалось получить данные артистов
 * @example
 * const topArtists = await getTopArtists(20);
 */
export async function getTopArtists(limit: number = 12): Promise<LastFmArtist[]> {
  try {
    const data = await fetchLastFmData<LastFmArtistsResponse>('chart.gettopartists', {
      limit: limit.toString()
    });

    if (!data.artists?.artist) {
      throw new Error('Invalid response structure: missing artists data');
    }

    return data.artists.artist;
  } catch (error) {
    console.error('Failed to fetch top artists:', error);
    throw error;
  }
}

/**
 * Получает список самых популярных треков на данный момент
 * @param {number} limit Количество треков для получения (по умолчанию 18)
 * @returns {Promise<LastFmTrack[]>} Массив треков с их данными
 * @throws {Error} Если не удалось получить данные треков
 * @example
 * const topTracks = await getTopTracks(30);
 */
export async function getTopTracks(limit: number = 18): Promise<LastFmTrack[]> {
  try {
    const data = await fetchLastFmData<LastFmTracksResponse>('chart.gettoptracks', {
      limit: limit.toString()
    });

    if (!data.tracks?.track) {
      throw new Error('Invalid response structure: missing tracks data');
    }

    return data.tracks.track;
  } catch (error) {
    console.error('Failed to fetch top tracks:', error);
    throw error;
  }
}

/**
 * Выполняет поиск артистов по заданному запросу
 * @param {string} query Поисковый запрос
 * @param {number} limit Максимальное количество результатов (по умолчанию 10)
 * @returns {Promise<LastFmArtist[]>} Массив найденных артистов
 * @example
 * const results = await searchArtists('Arctic Monkeys', 15);
 */
export async function searchArtists(
  query: string,
  limit: number = 10
): Promise<LastFmArtist[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const data = await fetchLastFmData<LastFmArtistSearchResponse>('artist.search', {
      artist: query,
      limit: limit.toString()
    });

    if (!data.results?.artistmatches?.artist) {
      return [];
    }

    return normalizeApiData(data.results.artistmatches.artist);
  } catch (error) {
    console.error('Failed to search artists:', error);
    return [];
  }
}

/**
 * Выполняет поиск альбомов по заданному запросу
 * @param {string} query Поисковый запрос
 * @param {number} limit Максимальное количество результатов (по умолчанию 10)
 * @returns {Promise<LastFmAlbum[]>} Массив найденных альбомов
 * @example
 * const results = await searchAlbums('AM', 20);
 */
export async function searchAlbums(
  query: string,
  limit: number = 10
): Promise<LastFmAlbum[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const data = await fetchLastFmData<LastFmAlbumSearchResponse>('album.search', {
      album: query,
      limit: limit.toString()
    });

    if (!data.results?.albummatches?.album) {
      return [];
    }

    return normalizeApiData(data.results.albummatches.album);
  } catch (error) {
    console.error('Failed to search albums:', error);
    return [];
  }
}

/**
 * Выполняет поиск треков по заданному запросу
 * @param {string} query Поисковый запрос
 * @param {number} limit Максимальное количество результатов (по умолчанию 10)
 * @returns {Promise<LastFmTrack[]>} Массив найденных треков
 * @example
 * const results = await searchTracks('Do I Wanna Know', 25);
 */
export async function searchTracks(
  query: string,
  limit: number = 10
): Promise<LastFmTrack[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const data = await fetchLastFmData<LastFmTrackSearchResponse>('track.search', {
      track: query,
      limit: limit.toString()
    });

    if (!data.results?.trackmatches?.track) {
      return [];
    }

    return normalizeApiData(data.results.trackmatches.track);
  } catch (error) {
    console.error('Failed to search tracks:', error);
    return [];
  }
}