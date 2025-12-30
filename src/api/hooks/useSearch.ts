import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { searchService } from '../services/search';
import type {
  SearchAlbumsResponse,
  SearchAllResponse,
  SearchArtistsResponse,
  SearchParams,
  SearchPlaylistsResponse,
  SearchSongsResponse,
} from '../types';

/**
 * Query Keys for search
 */
export const searchKeys = {
  all: ['search'] as const,
  lists: () => [...searchKeys.all, 'list'] as const,
  list: (params: SearchParams) => [...searchKeys.lists(), params] as const,
  songs: (params: SearchParams) => [...searchKeys.all, 'songs', params] as const,
  albums: (params: SearchParams) => [...searchKeys.all, 'albums', params] as const,
  artists: (params: SearchParams) => [...searchKeys.all, 'artists', params] as const,
  playlists: (params: SearchParams) => [...searchKeys.all, 'playlists', params] as const,
};

/**
 * Hook to search across all categories
 * @param params - Search parameters
 * @param options - React Query options
 */
export const useSearchAll = (
  params: SearchParams,
  options?: Omit<UseQueryOptions<SearchAllResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchAllResponse>({
    queryKey: searchKeys.list(params),
    queryFn: () => searchService.searchAll(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to search for songs only
 * @param params - Search parameters
 * @param options - React Query options
 */
export const useSearchSongs = (
  params: SearchParams,
  options?: Omit<UseQueryOptions<SearchSongsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchSongsResponse>({
    queryKey: searchKeys.songs(params),
    queryFn: () => searchService.searchSongs(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to search for albums only
 * @param params - Search parameters
 * @param options - React Query options
 */
export const useSearchAlbums = (
  params: SearchParams,
  options?: Omit<UseQueryOptions<SearchAlbumsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchAlbumsResponse>({
    queryKey: searchKeys.albums(params),
    queryFn: () => searchService.searchAlbums(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to search for artists only
 * @param params - Search parameters
 * @param options - React Query options
 */
export const useSearchArtists = (
  params: SearchParams,
  options?: Omit<UseQueryOptions<SearchArtistsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchArtistsResponse>({
    queryKey: searchKeys.artists(params),
    queryFn: () => searchService.searchArtists(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to search for playlists only
 * @param params - Search parameters
 * @param options - React Query options
 */
export const useSearchPlaylists = (
  params: SearchParams,
  options?: Omit<UseQueryOptions<SearchPlaylistsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchPlaylistsResponse>({
    queryKey: searchKeys.playlists(params),
    queryFn: () => searchService.searchPlaylists(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
