import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useArtistSongs } from '../../../api/hooks';
import { useTheme } from '../../../context/ThemeContext';
import { useSongActions } from '../../../hooks';
import { useAppSelector } from '../../../store/hooks';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SuggestionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { playSong, getImageUrl, getArtistName } = useSongActions();

  const { history, stats } = useAppSelector((state) => state.library);

  const recentlyPlayed = history.filter(item => item.type === 'song');
  const lastPlayedSongId = recentlyPlayed[0]?.id || '';
  const lastPlayedSongData = recentlyPlayed[0]?.data;
  const lastArtistId = lastPlayedSongData?.artists?.primary?.[0]?.id;
  const lastArtistName = lastPlayedSongData?.artists?.primary?.[0]?.name;

  // const { data: suggestionsData, isLoading: isSuggestionsLoading } = useSongSuggestions(lastPlayedSongId, {
  //   enabled: !!lastPlayedSongId,
  // });

  const { data: artistSongsData, isLoading: isArtistSongsLoading } = useArtistSongs(lastArtistId, undefined, {
    enabled: !!lastArtistId,
  });

  const mostPlayed = useMemo(() => {
    return Object.values(stats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(stat => stat.item)
      .filter(item => item.type === 'song');
  }, [stats]);

  const artists = useMemo(() => {
    const artistMap = new Map();
    
    // Iterate through history to find unique artists
    history.forEach(item => {
      if (item.type === 'song' && item.data?.artists?.primary) {
        item.data.artists.primary.forEach((artist: any) => {
          if (!artistMap.has(artist.id)) {
            // Find best image (prefer 150x150)
            const image = artist.image?.find((img: any) => img.quality === '150x150')?.url 
              || artist.image?.[0]?.url 
              || 'https://picsum.photos/200/200';

            artistMap.set(artist.id, {
              id: artist.id,
              name: artist.name,
              image: image,
            });
          }
        });
      }
    });

    return Array.from(artistMap.values());
  }, [history]);

  const handlePlaySong = (item: any) => {
    // Use the stored data to play
    if (item.data) {
      playSong(item.data);
    } else {
      // For suggestions, the item itself is the song data
      playSong(item);
    }
  };

  const handleArtistPress = (artist: any) => {
    console.log(artist);
    navigation.navigate('ArtistDetails', {
      artistId: artist.id,
      name: artist.name,
      albums: 0,
      songs: 0,
      imageUrl: artist.image,
    });
  };

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Recommended for You
      {lastPlayedSongId && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recommended for You
            </Text>
          </View>
          {isSuggestionsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : suggestionsData?.data ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestionsData.data.map((item: any, index: number) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.songCard, index === 0 && styles.firstCard]}
                  onPress={() => handlePlaySong(item)}
                >
                  <Image
                    source={{ uri: getImageUrl(item) }}
                    style={styles.songCover}
                  />
                  <Text
                    style={[styles.songTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.songArtist, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {getArtistName(item)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            renderEmptyState('No recommendations available')
          )}
        </View>
      )} */}

      {/* More from Artist */}
      {lastArtistId && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              More from {lastArtistName}
            </Text>
          </View>
          {isArtistSongsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : artistSongsData?.data?.songs ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {artistSongsData.data.songs.map((item: any, index: number) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.songCard, index === 0 && styles.firstCard]}
                  onPress={() => handlePlaySong(item)}
                >
                  <Image
                    source={{ uri: getImageUrl(item) }}
                    style={styles.songCover}
                  />
                  <Text
                    style={[styles.songTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.songArtist, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {getArtistName(item)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            renderEmptyState('No songs found')
          )}
        </View>
      )}

      {/* Recently Played */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recently Played
          </Text>
          {recentlyPlayed.length > 0 && (
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        {recentlyPlayed.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyPlayed.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.songCard, index === 0 && styles.firstCard]}
                onPress={() => handlePlaySong(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.songCover}
                />
                <Text
                  style={[styles.songTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={[styles.songArtist, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          renderEmptyState('Play some music to see your history')
        )}
      </View>

      {/* Artists */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Artists</Text>
          {artists.length > 0 && (
            <TouchableOpacity
                activeOpacity={0.7}
              >
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        {artists.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {artists.map((artist: any, index: number) => (
              <TouchableOpacity
                key={artist.id}
                style={[styles.artistCard, index === 0 && styles.firstCard]}
                onPress={()=>handleArtistPress(artist)}
              >
                <Image
                  source={{ uri: artist.image }}
                  style={styles.artistImage}
                />
                <Text
                  style={[styles.artistName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {artist.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          renderEmptyState('Play songs to see artists here')
        )}
      </View>

      {/* Most Played */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Most Played
          </Text>
          {mostPlayed.length > 0 && (
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        {mostPlayed.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mostPlayed.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePlaySong(item)}
                style={[styles.songCard, index === 0 && styles.firstCard]}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.songCover}
                />
                <Text
                  style={[styles.songTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={[styles.songArtist, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          renderEmptyState('Your most played tracks will appear here')
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  lastSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  firstCard: {
    marginLeft: 20,
  },
  songCard: {
    width: 160,
    marginRight: 16,
  },
  songCover: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 12,
  },
  artistCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default SuggestionScreen;