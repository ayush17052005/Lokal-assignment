import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSearchAlbums, useSearchArtists, useSearchPlaylists, useSearchSongs } from '../../api/hooks';
import MiniPlayer from '../../components/MiniPlayer/MiniPlayer';
import { useTheme } from '../../context/ThemeContext';
import { useAlbumActions, useArtistActions, useSongActions } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addRecentSearch, clearAllRecentSearches, removeRecentSearch } from '../../store/slices/recentSearchesSlice';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SearchState = 'default' | 'searching' | 'notfound' | 'results';

const SearchScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const recentSearches = useAppSelector((state) => state.recentSearches.searches);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('default');
  const [activeFilter, setActiveFilter] = useState('Songs');
  
  // Centralized action hooks
  const { playSong, getImageUrl: getSongImage } = useSongActions();
  const { openArtistDetails, getImageUrl: getArtistImage } = useArtistActions();
  const { openAlbumDetails, getImageUrl: getAlbumImage } = useAlbumActions();

  const filters = ['Songs', 'Artists', 'Albums', 'Playlists'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: songsData, isLoading: songsLoading } = useSearchSongs(
    { query: debouncedQuery, page: 0, limit: 20 },
    { enabled: activeFilter === 'Songs' && debouncedQuery.length > 0 }
  );

  const { data: albumsData, isLoading: albumsLoading } = useSearchAlbums(
    { query: debouncedQuery, page: 0, limit: 20 },
    { enabled: activeFilter === 'Albums' && debouncedQuery.length > 0 }
  );

  const { data: artistsData, isLoading: artistsLoading } = useSearchArtists(
    { query: debouncedQuery, page: 0, limit: 20 },
    { enabled: activeFilter === 'Artists' && debouncedQuery.length > 0 }
  );

  const { data: playlistsData, isLoading: playlistsLoading } = useSearchPlaylists(
    { query: debouncedQuery, page: 0, limit: 20 },
    { enabled: activeFilter === 'Playlists' && debouncedQuery.length > 0 }
  );

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setSearchState('default');
      return;
    }

    const isLoading = songsLoading || albumsLoading || artistsLoading || playlistsLoading;
    
    if (isLoading) {
      setSearchState('searching');
      return;
    }

    let hasResults = false;
    switch (activeFilter) {
      case 'Songs':
        hasResults = (songsData?.data?.results?.length || 0) > 0;
        break;
      case 'Albums':
        hasResults = (albumsData?.data?.results?.length || 0) > 0;
        break;
      case 'Artists':
        hasResults = (artistsData?.data?.results?.length || 0) > 0;
        break;
      case 'Playlists':
        hasResults = (playlistsData?.data?.results?.length || 0) > 0;
        break;
    }

    const newState = hasResults ? 'results' : 'notfound';
    setSearchState(newState);
    
    // Add to recent searches when we get results
    if (hasResults && debouncedQuery.trim()) {
      dispatch(addRecentSearch(debouncedQuery.trim()));
    }
  }, [debouncedQuery, songsData, albumsData, artistsData, playlistsData, activeFilter, songsLoading, albumsLoading, artistsLoading, playlistsLoading, dispatch]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchState('default');
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  const handleRemoveRecentSearch = (search: string) => {
    dispatch(removeRecentSearch(search));
  };

  const handleClearAllRecent = () => {
    dispatch(clearAllRecentSearches());
  };

  const renderDefaultState = () => (
    <View style={styles.defaultContainer}>
      <View style={styles.recentHeader}>
        <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Searches</Text>
        {recentSearches.length > 0 && (
          <TouchableOpacity onPress={handleClearAllRecent}>
            <Text style={[styles.clearAllText, { color: colors.primary }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {recentSearches.length > 0 ? (
        <FlatList
          data={recentSearches}
          renderItem={renderRecentSearchItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyRecent}>
          <Text style={[styles.emptyRecentText, { color: colors.textSecondary }]}>
            No recent searches
          </Text>
        </View>
      )}
    </View>
  );

  const renderNotFoundState = () => (
    <View style={styles.notFoundContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter
                ? { backgroundColor: colors.primary }
                : { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 1 },
            ]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === filter ? '#FFFFFF' : colors.primary },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.notFoundContent}>
        <View style={styles.illustrationContainer}>
          <View style={[styles.sadFace, { backgroundColor: colors.primary }]}>
            <View style={styles.eyesContainer}>
              <View style={[styles.eye, { backgroundColor: isDark ? '#1A1A1A' : '#2A2A5A' }]} />
              <View style={[styles.eye, { backgroundColor: isDark ? '#1A1A1A' : '#2A2A5A' }]} />
            </View>
            <View style={[styles.mouth, { backgroundColor: isDark ? '#1A1A1A' : '#2A2A5A' }]} />
          </View>
          <View style={styles.personContainer}>
            <View style={[styles.person, { backgroundColor: isDark ? colors.textSecondary : '#5A5A8A' }]} />
          </View>
        </View>
        <Text style={[styles.notFoundTitle, { color: colors.text }]}>Not Found</Text>
        <Text style={[styles.notFoundMessage, { color: colors.textSecondary }]}>
          Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
        </Text>
      </View>
    </View>
  );

  const renderRecentSearchItem = ({ item }: { item: string }) => (
    <View style={styles.recentSearchItem}>
      <TouchableOpacity
        style={styles.recentSearchContent}
        onPress={() => handleRecentSearchPress(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.recentSearchText, { color: colors.text }]}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleRemoveRecentSearch(item)}
        style={styles.removeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderSongItem = ({ item }: { item: any }) => {
    const coverUrl = getSongImage(item, '150x150');

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => playSong(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: coverUrl }} style={styles.resultCover} />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.artists?.primary?.[0]?.name || 'Unknown Artist'}
          </Text>
        </View>
        <TouchableOpacity style={styles.resultPlayButton} onPress={() => playSong(item)}>
          <Ionicons name="play-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.resultMoreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderAlbumItem = ({ item }: { item: any }) => {
    const coverUrl = getAlbumImage(item, '150x150');

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => openAlbumDetails(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: coverUrl }} style={styles.resultCover} />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.artists?.primary?.[0]?.name || 'Unknown Artist'}
          </Text>
        </View>
        <TouchableOpacity style={styles.resultMoreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderArtistItem = ({ item }: { item: any }) => {
    const imageUrl = getArtistImage(item, '150x150');

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => openArtistDetails(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUrl }} style={[styles.resultCover, { borderRadius: 30 }]} />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            Artist
          </Text>
        </View>
        <TouchableOpacity style={styles.resultMoreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderPlaylistItem = ({ item }: { item: any }) => {
    const coverUrl = item.image?.find((img: any) => img.quality === '150x150')?.url ||
                     item.image?.[0]?.url ||
                     'https://picsum.photos/200/200';

    return (
      <TouchableOpacity
        style={styles.resultItem}
        activeOpacity={0.7}
      >
        <Image source={{ uri: coverUrl }} style={styles.resultCover} />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            Playlist
          </Text>
        </View>
        <TouchableOpacity style={styles.resultMoreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderResultsState = () => {
    let data: any[] = [];
    let renderItem: any;

    switch (activeFilter) {
      case 'Songs':
        data = songsData?.data?.results || [];
        renderItem = renderSongItem;
        console.log('Songs Data:', data[0]);
        break;
      case 'Albums':
        data = albumsData?.data?.results || [];
        renderItem = renderAlbumItem;
        break;
      case 'Artists':
        data = artistsData?.data?.results || [];
        renderItem = renderArtistItem;
        break;
      case 'Playlists':
        data = playlistsData?.data?.results || [];
        renderItem = renderPlaylistItem;
        break;
    }

    return (
      <View style={styles.resultsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 1 },
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === filter ? '#FFFFFF' : colors.primary },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContent}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No {activeFilter.toLowerCase()} found
              </Text>
            </View>
          }
        />
      </View>
    );
  };

  const renderSearchingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching...</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
              borderColor: searchState === 'default' && searchQuery === '' ? colors.primary : 'transparent',
              borderWidth: searchState === 'default' && searchQuery === '' ? 1 : 0,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for songs, artists..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchState === 'default' && renderDefaultState()}
      {searchState === 'searching' && renderSearchingState()}
      {searchState === 'notfound' && renderNotFoundState()}
      {searchState === 'results' && renderResultsState()}
      
      <MiniPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  defaultContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  recentSearchContent: {
    flex: 1,
  },
  recentSearchText: {
    fontSize: 16,
  },
  removeButton: {
    padding: 4,
  },
  emptyRecent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyRecentText: {
    fontSize: 16,
  },
  filterContainer: {
    maxHeight: 40,
  },
  filterContent: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
  },
  notFoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  sadFace: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  eye: {
    width: 35,
    height: 20,
    borderRadius: 20,
    transform: [{ rotate: '10deg' }],
  },
  mouth: {
    width: 60,
    height: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  personContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  person: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  notFoundMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultArtist: {
    fontSize: 14,
  },
  resultPlayButton: {
    marginRight: 8,
  },
  resultMoreButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  emptyResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default SearchScreen;