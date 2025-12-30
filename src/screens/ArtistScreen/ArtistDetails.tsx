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

interface ArtistDetailsProps {
  route: {
    params: {
      artistId: string;
      name: string;
      albums: number;
      songs: number;
      imageUrl: string;
    };
  };
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({ route }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { artistId, name, albums, songs, imageUrl } = route.params;
  const [isShuffleActive, setIsShuffleActive] = useState(false);

  // Sample songs data - replace with real data
  const artistSongs = [
    { id: '1', title: 'Bang Bang', artist: name, cover: 'https://picsum.photos/200/200?random=11' },
    { id: '2', title: 'The Light Is Coming', artist: name, cover: 'https://picsum.photos/200/200?random=12' },
    { id: '3', title: 'Dangerous Woman', artist: name, cover: 'https://picsum.photos/200/200?random=13' },
  ];

  const handlePlaySong = (song: typeof artistSongs[0]) => {
    navigation.navigate('Player', {
      songId: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.cover,
    });
  };

  const handleShuffle = () => {
    setIsShuffleActive(!isShuffleActive);
    // Implement shuffle logic
  };

  const handlePlayAll = () => {
    // Play all songs
    if (artistSongs.length > 0) {
      handlePlaySong(artistSongs[0]);
    }
  };

  const renderSongItem = ({ item }: { item: typeof artistSongs[0] }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => handlePlaySong(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.cover }} style={styles.songCover} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.songPlayButton}>
        <Ionicons name="play-circle" size={32} color={colors.primary} />
      </TouchableOpacity>
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
        {/* Artist Cover & Info */}
        <View style={styles.artistSection}>
          <Image source={{ uri: imageUrl }} style={styles.artistCover} />
          <Text style={[styles.artistName, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.artistMeta, { color: colors.textSecondary }]}>
            {albums} Album  |  {songs} Songs  |  01:25:43 mins
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
            <Text style={[styles.songsTitle, { color: colors.text }]}>Songs</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={artistSongs}
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
  artistSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  artistCover: {
    width: 280,
    height: 280,
    borderRadius: 24,
    marginBottom: 20,
  },
  artistName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  artistMeta: {
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
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  songCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
  },
  songPlayButton: {
    marginRight: 8,
  },
  songMoreButton: {
    padding: 8,
  },
});

export default ArtistDetails;