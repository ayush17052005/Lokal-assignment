import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { playlistsService } from '../services/playlists';
import type { PlaylistDetailResponse } from '../types';

export const playlistsKeys = {
  all: ['playlists'] as const,
  details: () => [...playlistsKeys.all, 'detail'] as const,
  detail: (id: string, page: number, limit: number) => [...playlistsKeys.details(), id, page, limit] as const,
};

export const usePlaylistById = (
  id: string,
  page: number = 0,
  limit: number = 10,
  options?: Omit<UseQueryOptions<PlaylistDetailResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PlaylistDetailResponse>({
    queryKey: playlistsKeys.detail(id, page, limit),
    queryFn: () => playlistsService.getPlaylistById(id, page, limit),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};
