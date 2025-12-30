import { apiClient } from '../client';
import type {
    ArtistAlbumsResponse,
    ArtistDetailResponse,
    ArtistSongsResponse,
    ArtistsResponse,
    PaginationParams,
} from '../types';

/**
 * Artists API Service
 * All artist-related API calls
 */
export const artistsService = {
  /**
   * Get list of artists with pagination
   * @param params - Pagination parameters
   */
  getArtists: async (params?: PaginationParams): Promise<ArtistsResponse> => {
    return apiClient.get('/api/artists', { params });
  },

  /**
   * Get artist details by ID
   * @param id - Artist ID
   */
  getArtistById: async (id: string): Promise<ArtistDetailResponse> => {
    return apiClient.get(`/api/artists/${id}`);
  },

  /**
   * Get artist's songs
   * @param id - Artist ID
   * @param params - Pagination parameters
   */
  getArtistSongs: async (
    id: string,
    params?: PaginationParams
  ): Promise<ArtistSongsResponse> => {
    return apiClient.get(`/api/artists/${id}/songs`, { params });
  },

  /**
   * Get artist's albums
   * @param id - Artist ID
   * @param params - Pagination parameters
   */
  getArtistAlbums: async (
    id: string,
    params?: PaginationParams
  ): Promise<ArtistAlbumsResponse> => {
    return apiClient.get(`/api/artists/${id}/albums`, { params });
  },
};
