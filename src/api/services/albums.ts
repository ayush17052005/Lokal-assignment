import { apiClient } from '../client';
import type { AlbumDetailResponse } from '../types';

/**
 * Albums API Service
 */
export const albumsService = {
  /**
   * Get album details by ID
   * @param id - Album ID
   */
  getAlbumById: async (id: string): Promise<AlbumDetailResponse> => {
    return apiClient.get('/api/albums', { params: { id } });
  },
};
