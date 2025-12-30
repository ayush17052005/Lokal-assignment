import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { artistsService } from '../services/artists';
import type {
  ArtistAlbumsResponse,
  ArtistDetailResponse,
  ArtistSongsResponse,
  ArtistsResponse,
  PaginationParams,
} from '../types';

/**
 * Query Keys for artists
 */
export const artistsKeys = {
  all: ['artists'] as const,
  lists: () => [...artistsKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...artistsKeys.lists(), params] as const,
  details: () => [...artistsKeys.all, 'detail'] as const,
  detail: (id: string) => [...artistsKeys.details(), id] as const,
  songs: (id: string, params?: PaginationParams) => 
    [...artistsKeys.all, 'songs', id, params] as const,
  albums: (id: string, params?: PaginationParams) => 
    [...artistsKeys.all, 'albums', id, params] as const,
};

/**
 * Hook to get list of artists
 * @param params - Pagination parameters
 * @param options - React Query options
 */
export const useArtists = (
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<ArtistsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ArtistsResponse>({
    queryKey: artistsKeys.list(params),
    queryFn: () => artistsService.getArtists(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to get artist details by ID
 * @param id - Artist ID
 * @param options - React Query options
 */
export const useArtistById = (
  id: string,
  options?: Omit<UseQueryOptions<ArtistDetailResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ArtistDetailResponse>({
    queryKey: artistsKeys.detail(id),
    queryFn: () => artistsService.getArtistById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

/**
 * Hook to get artist's songs
 * @param id - Artist ID
 * @param params - Pagination parameters
 * @param options - React Query options
 */
export const useArtistSongs = (
  id: string,
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<ArtistSongsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ArtistSongsResponse>({
    queryKey: artistsKeys.songs(id, params),
    queryFn: () => artistsService.getArtistSongs(id, params),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get artist's albums
 * @param id - Artist ID
 * @param params - Pagination parameters
 * @param options - React Query options
 */
export const useArtistAlbums = (
  id: string,
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<ArtistAlbumsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ArtistAlbumsResponse>({
    queryKey: artistsKeys.albums(id, params),
    queryFn: () => artistsService.getArtistAlbums(id, params),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
