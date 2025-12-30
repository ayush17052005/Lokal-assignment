import { apiClient } from '../client';
import type {
    SearchAlbumsResponse,
    SearchAllResponse,
    SearchArtistsResponse,
    SearchParams,
    SearchPlaylistsResponse,
    SearchSongsResponse,
} from '../types';

/**
 * Search API Service
 * All search-related API calls
 */
export const searchService = {
  /**
   * Search across all categories (songs, albums, artists, playlists)
   * @param params - Search parameters
   */
  searchAll: async (params: SearchParams): Promise<SearchAllResponse> => {
    return apiClient.get('/api/search', { params });
  },

  /**
   * Search for songs only
   * @param params - Search parameters
   */
  searchSongs: async (params: SearchParams): Promise<SearchSongsResponse> => {
    return apiClient.get('/api/search/songs', { params });
  },

  /**
   * Search for albums only
   * @param params - Search parameters
   */
  searchAlbums: async (params: SearchParams): Promise<SearchAlbumsResponse> => {
    return apiClient.get('/api/search/albums', { params });
  },

  /**
   * Search for artists only
   * @param params - Search parameters
   */
  searchArtists: async (params: SearchParams): Promise<SearchArtistsResponse> => {
    return apiClient.get('/api/search/artists', { params });
  },

  /**
   * Search for playlists only
   * @param params - Search parameters
   */
  searchPlaylists: async (params: SearchParams): Promise<SearchPlaylistsResponse> => {
    return apiClient.get('/api/search/playlists', { params });
  },
};
