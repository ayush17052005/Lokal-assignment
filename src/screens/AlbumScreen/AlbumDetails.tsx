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
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AlbumDetailsProps {
  route: {
    params: {
      albumId: string;
      name: string;
      artist: string;
      year: string;
      songs: number;
      imageUrl: string;
    };
  };
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ route }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { albumId, name, artist, year, songs, imageUrl } = route.params;
  const [isShuffleActive, setIsShuffleActive] = useState(false);

  // Sample songs data - replace with real data from API
  const albumSongs = [
    { id: '1', title: 'Track 1', artist: artist, cover: imageUrl, duration: '3:45' },
    { id: '2', title: 'Track 2', artist: artist, cover: imageUrl, duration: '4:12' },
    { id: '3', title: 'Track 3', artist: artist, cover: imageUrl, duration: '3:28' },
    { id: '4', title: 'Track 4', artist: artist, cover: imageUrl, duration: '5:01' },
    { id: '5', title: 'Track 5', artist: artist, cover: imageUrl, duration: '3:56' },
  ];

  const handlePlaySong = (song: typeof albumSongs[0]) => {
    // TODO: Implement player
    console.log('Play song:', song.title);
  };

  const handleShuffle = () => {
    setIsShuffleActive(!isShuffleActive);
    // Implement shuffle logic
  };

  const handlePlayAll = () => {
    // Play all songs
    if (albumSongs.length > 0) {
      handlePlaySong(albumSongs[0]);
    }
  };

  const renderSongItem = ({ item, index }: { item: typeof albumSongs[0]; index: number }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => handlePlaySong(item)}
      activeOpacity={0.7}
    >
      <Text style={[styles.trackNumber, { color: colors.textSecondary }]}>
        {(index + 1).toString().padStart(2, '0')}
      </Text>
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text style={[styles.songDuration, { color: colors.textSecondary }]}>
        {item.duration}
      </Text>
      <TouchableOpacity style={styles.songMoreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'dark-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Album Cover & Info */}
        <View style={styles.albumSection}>
          <Image source={{ uri: imageUrl }} style={styles.albumCover} />
          <Text style={[styles.albumName, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.albumArtist, { color: colors.textSecondary }]}>{artist}</Text>
          <Text style={[styles.albumMeta, { color: colors.textSecondary }]}>
            {year}  |  {songs} Songs
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.shuffleButton,
              { backgroundColor: isShuffleActive ? colors.primary : colors.primary },
            ]}
            onPress={handleShuffle}
            activeOpacity={0.8}
          >
            <Ionicons name="shuffle" size={20} color="#FFFFFF" />
            <Text style={styles.shuffleText}>Shuffle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
            onPress={handlePlayAll}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={20} color={colors.primary} />
            <Text style={[styles.playText, { color: colors.primary }]}>Play</Text>
          </TouchableOpacity>
        </View>

        {/* Songs Section */}
        <View style={styles.songsSection}>
          <View style={styles.songsSectionHeader}>
            <Text style={[styles.songsTitle, { color: colors.text }]}>Tracks</Text>
          </View>

          <FlatList
            data={albumSongs}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
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
    paddingVertical: 12,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  searchButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  moreButton: {
    marginLeft: 12,
    padding: 8,
  },
  albumSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  albumCover: {
    width: 280,
    height: 280,
    borderRadius: 24,
    marginBottom: 20,
  },
  albumName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  albumArtist: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  albumMeta: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  shuffleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  shuffleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  playText: {
    fontSize: 16,
    fontWeight: '600',
  },
  songsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    paddingBottom: 40,
  },
  songsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  songsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  trackNumber: {
    width: 40,
    fontSize: 16,
    fontWeight: '600',
  },
  songInfo: {
    flex: 1,
    marginLeft: 8,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
  },
  songDuration: {
    fontSize: 14,
    marginRight: 12,
  },
  songMoreButton: {
    padding: 8,
  },
});

export default AlbumDetails;