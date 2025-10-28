import {
  LastFmArtistsResponse,
  LastFmTracksResponse,
  LastFmTopTagsResponse,
  LastFmImage,
  LastFmArtist,
  LastFmArtistSearchResponse,
  LastFmAlbum,
  LastFmAlbumSearchResponse,
  LastFmTrackSearchResponse,
  LastFmTrack,
  LastFmTopTags
} from './types';

const API_KEY = '91e4497c7ee6e5c159aaaa1385347e5e';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Выполняет запрос к API Last.fm с указанным методом и параметрами
 * @template T - Тип ожидаемого ответа от API
 * @param {string} method - Метод API Last.fm для вызова
 * @param {Record<string, string>} params - Дополнительные параметры запроса
 * @returns {Promise<T>} Промис с данными ответа от API
 * @throws {Error} Выбрасывает ошибку при неудачном HTTP-запросе или ошибке API
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || 'API Error');
    }

    return data as T;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Извлекает URL изображения нужного размера из массива изображений Last.fm
 * @param {LastFmImage[]} images - Массив изображений от Last.fm API
 * @param {'small' | 'medium' | 'large' | 'extralarge' | 'mega'} size - Желаемый размер изображения
 * @returns {string | null} URL изображения или null, если изображение не найдено
 */
export function getImageUrl(
  images: LastFmImage[],
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' = 'large'
): string | null {
  if (!images || !Array.isArray(images)) return null;

  const sizeMap: Record<string, number> = {
    'small': 0,
    'medium': 1,
    'large': 2,
    'extralarge': 3,
    'mega': 4
  };

  const index = sizeMap[size];
  const image = images[index];

  return image && image['#text'] ? image['#text'] : null;
}

/**
 * Форматирует теги артиста/трека в строку жанров, разделенную точками
 * @param {LastFmTopTags | undefined} tags - Объект тегов от Last.fm API
 * @returns {string} Строка с первыми 3 жанрами, разделенными символом "·"
 */
export function getGenres(tags?: LastFmTopTags): string {
  return tags && tags.tag
    ? tags.tag.slice(0, 3).map(tag => tag.name).join('\u00a0\u00b7\u00a0')
    : '';
}

/**
 * Получает список топовых артистов с их тегами
 * @param {number} limit - Количество артистов для получения (по умолчанию 12)
 * @returns {Promise<LastFmArtist[]>} Промис с массивом артистов, включая их теги
 * @throws {Error} Выбрасывает ошибку, если данные артистов не получены
 */
export async function getTopArtists(limit: number = 12): Promise<LastFmArtist[]> {
  const data = await fetchLastFmData<LastFmArtistsResponse>('chart.gettopartists', {
    limit: limit.toString()
  });

  if (!data.artists || !data.artists.artist) {
    throw new Error('No artists data received');
  }

  const artists = await Promise.all(
    data.artists.artist.map(async artist => {
      try {
        const tags = await fetchLastFmData<LastFmTopTagsResponse>('artist.gettoptags', {
          artist: artist.name,
          limit: '3'
        });
        artist.tags = tags.toptags;
        return artist;
      } catch (error) {
        console.warn(`Failed to fetch tags for ${artist.name}:`, error);
        return artist;
      }
    })
  );

  return artists;
}

/**
 * Получает список топовых треков с их тегами
 * @param {number} limit - Количество треков для получения (по умолчанию 18)
 * @returns {Promise<LastFmTrack[]>} Промис с массивом треков, включая их теги
 * @throws {Error} Выбрасывает ошибку, если данные треков не получены
 */
export async function getTopTracks(limit: number = 18): Promise<LastFmTrack[]> {
  const data = await fetchLastFmData<LastFmTracksResponse>('chart.gettoptracks', {
    limit: limit.toString()
  });

  if (!data.tracks || !data.tracks.track) {
    throw new Error('No tracks data received');
  }

  const tracks = await Promise.all(
    data.tracks.track.map(async track => {
      try {
        const tags = await fetchLastFmData<LastFmTopTagsResponse>('track.gettoptags', {
          track: track.name,
          artist: track.artist.name,
          limit: '3'
        });
        track.tags = tags.toptags;
        return track;
      } catch (error) {
        console.warn(`Failed to fetch tags for ${track.name}:`, error);
        return track;
      }
    })
  );

  return tracks;
}

/**
 * Выполняет поиск артистов по запросу
 * @param {string} query - Поисковый запрос
 * @param {number} limit - Максимальное количество результатов (по умолчанию 10)
 * @returns {Promise<LastFmArtist[]>} Промис с массивом найденных артистов
 */
export async function searchArtists(query: string, limit: number = 10): Promise<LastFmArtist[]> {
  try {
    const data = await fetchLastFmData<LastFmArtistSearchResponse>('artist.search', {
      artist: query,
      limit: limit.toString()
    });

    if (!data.results || !data.results.artistmatches || !data.results.artistmatches.artist) {
      return [];
    }

    const artists = Array.isArray(data.results.artistmatches.artist)
      ? data.results.artistmatches.artist
      : [data.results.artistmatches.artist];

    return artists;
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
}

/**
 * Выполняет поиск альбомов по запросу
 * @param {string} query - Поисковый запрос
 * @param {number} limit - Максимальное количество результатов (по умолчанию 10)
 * @returns {Promise<LastFmAlbum[]>} Промис с массивом найденных альбомов
 */
export async function searchAlbums(query: string, limit: number = 10): Promise<LastFmAlbum[]> {
  try {
    const data = await fetchLastFmData<LastFmAlbumSearchResponse>('album.search', {
      album: query,
      limit: limit.toString()
    });

    if (!data.results || !data.results.albummatches || !data.results.albummatches.album) {
      return [];
    }

    const albums = Array.isArray(data.results.albummatches.album)
      ? data.results.albummatches.album
      : [data.results.albummatches.album];

    return albums;
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
}

/**
 * Выполняет поиск треков по запросу
 * @param {string} query - Поисковый запрос
 * @param {number} limit - Максимальное количество результатов (по умолчанию 10)
 * @returns {Promise<LastFmTrack[]>} Промис с массивом найденных треков
 */
export async function searchTracks(query: string, limit: number = 10): Promise<LastFmTrack[]> {
  try {
    const data = await fetchLastFmData<LastFmTrackSearchResponse>('track.search', {
      track: query,
      limit: limit.toString()
    });

    if (!data.results || !data.results.trackmatches || !data.results.trackmatches.track) {
      return [];
    }

    const tracks = Array.isArray(data.results.trackmatches.track)
      ? data.results.trackmatches.track
      : [data.results.trackmatches.track];

    return tracks;
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}