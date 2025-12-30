// Common types
export interface Image {
  quality: string;
  link: string;
}

export interface DownloadUrl {
  quality: string;
  link: string;
}

// Song types
export interface Song {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  year: string;
  releaseDate: string;
  duration: number;
  label: string;
  primaryArtists: string;
  primaryArtistsId: string;
  featuredArtists: string;
  featuredArtistsId: string;
  explicitContent: boolean;
  playCount: number;
  language: string;
  hasLyrics: boolean;
  url: string;
  copyright: string;
  image: Image[];
  downloadUrl: DownloadUrl[];
}

export interface SongsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Song[];
  };
}

export interface SongDetailResponse {
  success: boolean;
  data: Song;
}

export interface SongSuggestionsResponse {
  success: boolean;
  data: Song[];
}

// Artist types
export interface Artist {
  id: string;
  name: string;
  url: string;
  role: string;
  image: Image[];
  type: string;
  isVerified: boolean;
  dominantLanguage?: string;
  dominantType?: string;
  followerCount?: number;
  fanCount?: number;
  isRadioPresent?: boolean;
  bio?: string;
}

export interface ArtistsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Artist[];
  };
}

export interface ArtistDetailResponse {
  success: boolean;
  data: Artist;
}

export interface ArtistSongsResponse {
  success: boolean;
  data: {
    total: number;
    songs: Song[];
  };
}

export interface Album {
  id: string;
  name: string;
  year: string;
  releaseDate: string;
  songCount: number;
  url: string;
  primaryArtistsId: string;
  primaryArtists: string;
  featuredArtists: string;
  artists: Artist[];
  image: Image[];
  songs?: Song[];
}

export interface ArtistAlbumsResponse {
  success: boolean;
  data: {
    total: number;
    albums: Album[];
  };
}

// Search types
export interface SearchAllResponse {
  success: boolean;
  data: {
    topQuery: {
      results: Array<Song | Album | Artist>;
    };
    songs: {
      results: Song[];
    };
    albums: {
      results: Album[];
    };
    artists: {
      results: Artist[];
    };
    playlists: {
      results: any[];
    };
  };
}

export interface SearchSongsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Song[];
  };
}

export interface SearchAlbumsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Album[];
  };
}

export interface SearchArtistsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Artist[];
  };
}

export interface SearchPlaylistsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: any[];
  };
}

// API Request Parameters
export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
