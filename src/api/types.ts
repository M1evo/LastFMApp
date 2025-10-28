export interface LastFmImage {
  '#text': string;
  size: string;
}

export interface LastFmTag {
  name: string;
  count: number;
  url: string;
}

export interface LastFmTopTags {
  tag: LastFmTag[];
}

export interface LastFmArtist {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: LastFmImage[];
  tags?: LastFmTopTags;
}

export interface LastFmAlbum {
  name: string;
  artist: string;
  mbid: string;
  url: string;
  image: LastFmImage[];
  playcount?: string;
  listeners?: string;
}

export interface LastFmTrackArtist {
  name: string;
  mbid: string;
  url: string;
}

export interface LastFmTrack {
  name: string;
  duration: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: {
    '#text': string;
    fulltrack: string;
  };
  artist: LastFmTrackArtist;
  image: LastFmImage[];
  tags?: LastFmTopTags;
}

export interface LastFmArtistsResponse {
  artists: {
    artist: LastFmArtist[];
    '@attr': {
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface LastFmTracksResponse {
  tracks: {
    track: LastFmTrack[];
    '@attr': {
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface LastFmTopTagsResponse {
  toptags: {
    tag: LastFmTag[];
  };
}

export interface LastFmArtistSearchResponse {
  results: {
    artistmatches: {
      artist: LastFmArtist[] | LastFmArtist;
    };
    '@attr': {
      for: string;
    };
  };
}

export interface LastFmAlbumSearchResponse {
  results: {
    albummatches: {
      album: LastFmAlbum[] | LastFmAlbum;
    };
    '@attr': {
      for: string;
    };
  };
}

export interface LastFmTrackSearchResponse {
  results: {
    trackmatches: {
      track: LastFmTrack[] | LastFmTrack;
    };
    '@attr': {
      for: string;
    };
  };
}