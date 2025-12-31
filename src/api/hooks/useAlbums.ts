import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { albumsService } from '../services/albums';
import type { AlbumDetailResponse } from '../types';

export const albumsKeys = {
  all: ['albums'] as const,
  details: () => [...albumsKeys.all, 'detail'] as const,
  detail: (id: string) => [...albumsKeys.details(), id] as const,
};

export const useAlbumById = (
  id: string,
  options?: Omit<UseQueryOptions<AlbumDetailResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<AlbumDetailResponse>({
    queryKey: albumsKeys.detail(id),
    queryFn: () => albumsService.getAlbumById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};
