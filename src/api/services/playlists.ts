import { apiClient } from '../client';
import type { PlaylistDetailResponse } from '../types';

/**
 * Playlists API Service
 */
export const playlistsService = {
  /**
   * Get playlist details by ID
   * @param id - Playlist ID
   * @param page - Page number (default 0)
   * @param limit - Items per page (default 10)
   */
  getPlaylistById: async (id: string, page: number = 0, limit: number = 10): Promise<PlaylistDetailResponse> => {
    return apiClient.get('/api/playlists', { params: { id, page, limit } });
  },
};
