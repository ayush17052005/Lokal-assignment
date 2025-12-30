import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
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
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SearchState = 'default' | 'notfound' | 'results';

const SearchScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('default');
  const [activeFilter, setActiveFilter] = useState('Songs');

  // Recent searches
  const [recentSearches, setRecentSearches] = useState([
    'Ariana Grande',
    'Morgan Wallen',
    'Justin Bieber',
    'Drake',
    'Olivia Rodrigo',
    'The Weeknd',
    'Taylor Swift',
    'Juice Wrld',
    'Memories',
  ]);

  // Search results (mock data)
  const searchResults = [
    { id: '1', title: 'Firework', artist: 'Katy Perry', cover: 'https://picsum.photos/200/200?random=20' },
    { id: '2', title: 'Firework - Accoustic', artist: 'The Waynes', cover: 'https://picsum.photos/200/200?random=21' },
    { id: '3', title: 'Last Friday Night', artist: 'Katy Perry', cover: 'https://picsum.photos/200/200?random=22' },
    { id: '4', title: 'Firework Cover', artist: 'The Sappeor', cover: 'https://picsum.photos/200/200?random=23' },
    { id: '5', title: 'Teenage Dream', artist: 'Katy Perry', cover: 'https://picsum.photos/200/200?random=24' },
    { id: '6', title: 'Roar', artist: 'Katy Perry', cover: 'https://picsum.photos/200/200?random=25' },
    { id: '7', title: 'Fireworks', artist: 'Sleep on it', cover: 'https://picsum.photos/200/200?random=26' },
    { id: '8', title: 'Fireworks at Dawn', artist: 'Sleep on it', cover: 'https://picsum.photos/200/200?random=27' },
  ];

  const filters = ['Songs', 'Artists', 'Albums', 'Folders'];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setSearchState('default');
    } else {
      // Simulate search - if query is "Abcdefghijklm", show not found
      if (text.toLowerCase() === 'abcdefghijklm') {
        setSearchState('notfound');
      } else {
        setSearchState('results');
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchState('default');
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(item => item !== search));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  const handlePlaySong = (song: typeof searchResults[0]) => {
    navigation.navigate('Player', {
      songId: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.cover,
    });
  };

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

  const renderSearchResultItem = ({ item }: { item: typeof searchResults[0] }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePlaySong(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.cover }} style={styles.resultCover} />
      <View style={styles.resultInfo}>
        <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.resultPlayButton}>
        <Ionicons name="play-circle" size={32} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.resultMoreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderDefaultState = () => (
    <View style={styles.defaultContainer}>
      {/* Recent Searches Header */}
      <View style={styles.recentHeader}>
        <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Searches</Text>
        <TouchableOpacity onPress={handleClearAllRecent}>
          <Text style={[styles.clearAllText, { color: colors.primary }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Searches List */}
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
      {/* Filter Tabs */}
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

      {/* Not Found Illustration */}
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

  const renderResultsState = () => (
    <View style={styles.resultsContainer}>
      {/* Filter Tabs */}
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

      {/* Results List */}
      <FlatList
        data={searchResults}
        renderItem={renderSearchResultItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContent}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
            placeholder="Abcdefghijklm"
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

      {/* Render based on state */}
      {searchState === 'default' && renderDefaultState()}
      {searchState === 'notfound' && renderNotFoundState()}
      {searchState === 'results' && renderResultsState()}
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
    paddingVertical:12,
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
});

export default SearchScreen;