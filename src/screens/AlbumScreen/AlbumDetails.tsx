import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAlbumById } from '../../api/hooks';
import { Song } from '../../api/types';
import Songinfo from '../../components/Songs/Songinfo';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer } from '../../hooks';
import { Track } from '../../store/slices/playerSlice';
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
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSongInfoVisible, setIsSongInfoVisible] = useState(false);
  const { playAlbum, currentTrack, isPlaying, addTrackToQueue, playTrackNext, shuffleQueue } = useAudioPlayer();

  const { data: albumData, isLoading } = useAlbumById(albumId);
  const albumSongs = albumData?.data?.songs || [];

  const getTrackFromSong = (song: Song): Track => {
    console.log(song);
    const artistName = song.artists?.primary?.[0]?.name  || artist;
    // Get highest quality image
    const coverUrl = song.image?.find(img => img.quality === '500x500')?.url || 
                     song.image?.[song.image.length - 1]?.url || 
                     imageUrl;
    
    // Get highest quality audio
    const audioUrl = song.downloadUrl?.find(url => url.quality === '320kbps')?.url || 
                     song.downloadUrl?.[song.downloadUrl.length - 1]?.url || 
                     song.url; // Fallback

    return {
      id: song.id,
      title: song.name,
      artist: artistName,
      coverUrl,
      audioUrl,
      duration: song.duration,
    };
  };

  const handlePlaySong = async (index: number) => {
    const tracks = albumSongs.map(getTrackFromSong);
    await playAlbum(tracks, index);
    navigation.navigate('Player', { songId: tracks[index].id });
  };

  const handleShuffle = () => {
    const tracks = albumSongs.map(getTrackFromSong);
    playAlbum(tracks, 0).then(() => {
        shuffleQueue();
        setIsShuffleActive(true);
    });
  };

  const handlePlayAll = () => {
    const tracks = albumSongs.map(getTrackFromSong);
    playAlbum(tracks, 0);
    setIsShuffleActive(false);
  };

  const handleSongOptions = (song: Song) => {
      setSelectedSong(song);
      setIsSongInfoVisible(true);
  };

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentSong = currentTrack?.id === item.id;
    const isSongPlaying = isCurrentSong && isPlaying;

    return (
    <TouchableOpacity
      style={[styles.songItem, isCurrentSong && { backgroundColor: isDark ? '#333' : '#e0e0e0', borderRadius: 8 }]}
      onPress={() => handlePlaySong(index)}
      activeOpacity={0.7}
    >
      <View style={styles.trackNumberContainer}>
          {isSongPlaying ? (
              <Ionicons name="musical-notes" size={16} color={colors.primary} />
          ) : (
            <Text style={[styles.trackNumber, { color: isCurrentSong ? colors.primary : colors.textSecondary }]}>
                {(index + 1).toString().padStart(2, '0')}
            </Text>
          )}
      </View>
      
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: isCurrentSong ? colors.primary : colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artists?.primary?.[0]?.name || artist}
        </Text>
      </View>
      <Text style={[styles.songDuration, { color: colors.textSecondary }]}>
        {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
      </Text>
      <TouchableOpacity style={styles.songMoreButton} onPress={() => handleSongOptions(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  )};

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
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

      {selectedSong && (
        <Songinfo
          isVisible={isSongInfoVisible}
          onClose={() => setIsSongInfoVisible(false)}
          song={selectedSong}
        />
      )}
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
    paddingHorizontal: 8,
  },
  trackNumberContainer: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
  },
  trackNumber: {
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