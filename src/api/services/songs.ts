import { apiClient } from '../client';
import type {
    PaginationParams,
    SongDetailResponse,
    SongsResponse,
    SongSuggestionsResponse,
} from '../types';

/**
 * Songs API Service
 * All song-related API calls
 */
export const songsService = {
  /**
   * Get list of songs with pagination
   * @param params - Pagination parameters
   */
  getSongs: async (params?: PaginationParams): Promise<SongsResponse> => {
    return apiClient.get('/api/songs', { params });
  },

  /**
   * Get song details by ID
   * @param id - Song ID
   */
  getSongById: async (id: string): Promise<SongDetailResponse> => {
    return apiClient.get(`/api/songs/${id}`);
  },

  /**
   * Get song suggestions based on a song ID
   * @param id - Song ID
   */
  getSongSuggestions: async (id: string): Promise<SongSuggestionsResponse> => {
    return apiClient.get(`/api/songs/${id}/suggestions`);
  },
};
