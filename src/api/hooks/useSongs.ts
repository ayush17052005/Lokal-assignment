import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { songsService } from '../services/songs';
import type {
  PaginationParams,
  SongDetailResponse,
  SongsResponse,
  SongSuggestionsResponse,
} from '../types';

/**
 * Query Keys for songs
 */
export const songsKeys = {
  all: ['songs'] as const,
  lists: () => [...songsKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...songsKeys.lists(), params] as const,
  details: () => [...songsKeys.all, 'detail'] as const,
  detail: (id: string) => [...songsKeys.details(), id] as const,
  suggestions: (id: string) => [...songsKeys.all, 'suggestions', id] as const,
};

/**
 * Hook to get list of songs
 * @param params - Pagination parameters
 * @param options - React Query options
 */
export const useSongs = (
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<SongsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SongsResponse>({
    queryKey: songsKeys.list(params),
    queryFn: () => songsService.getSongs(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to get song details by ID
 * @param id - Song ID
 * @param options - React Query options
 */
export const useSongById = (
  id: string,
  options?: Omit<UseQueryOptions<SongDetailResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SongDetailResponse>({
    queryKey: songsKeys.detail(id),
    queryFn: () => songsService.getSongById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

/**
 * Hook to get song suggestions
 * @param id - Song ID
 * @param options - React Query options
 */
export const useSongSuggestions = (
  id: string,
  options?: Omit<UseQueryOptions<SongSuggestionsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SongSuggestionsResponse>({
    queryKey: songsKeys.suggestions(id),
    queryFn: () => songsService.getSongSuggestions(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
