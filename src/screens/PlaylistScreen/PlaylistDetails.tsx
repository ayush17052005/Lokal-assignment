import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { usePlaylistById } from '../../api/hooks';
import { Song } from '../../api/types';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer } from '../../hooks';
import { Track } from '../../store/slices/playerSlice';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PlaylistDetailsProps {
  route: {
    params: {
      playlistId: string;
      name: string;
      imageUrl: string;
    };
  };
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({ route }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { playlistId, name, imageUrl } = route.params;
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const { playAlbum, currentTrack, isPlaying, shuffleQueue } = useAudioPlayer();

  const { data: playlistData, isLoading } = usePlaylistById(playlistId);
  const playlistSongs = playlistData?.data?.songs || [];

  const getTrackFromSong = (song: Song): Track => {
    const artistName = song.artists?.primary?.[0]?.name || 'Unknown Artist';
    const coverUrl = song.image?.find(img => img.quality === '500x500')?.url || 
                     song.image?.[song.image.length - 1]?.url || 
                     imageUrl;
    
    const audioUrl = song.downloadUrl?.find(url => url.quality === '320kbps')?.url || 
                     song.downloadUrl?.[song.downloadUrl.length - 1]?.url || 
                     song.url;

    return {
      id: song.id,
      title: song.name,
      artist: artistName,
      coverUrl,
      audioUrl,
      duration: song.duration,
      data: song,
    };
  };

  const handlePlaySong = async (index: number) => {
    const tracks = playlistSongs.map(getTrackFromSong);
    await playAlbum(tracks, index);
    navigation.navigate('Player', { songId: tracks[index].id });
  };

  const handleShuffle = () => {
    const tracks = playlistSongs.map(getTrackFromSong);
    playAlbum(tracks, 0).then(() => {
        shuffleQueue();
        setIsShuffleActive(true);
    });
  };

  const handlePlayAll = () => {
    const tracks = playlistSongs.map(getTrackFromSong);
    playAlbum(tracks, 0);
    setIsShuffleActive(false);
  };

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentSong = currentTrack?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.songItem, isCurrentSong && { backgroundColor: isDark ? '#333' : '#e0e0e0', borderRadius: 8 }]}
        onPress={() => handlePlaySong(index)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image?.[0]?.url || imageUrl }} style={styles.songCover} />
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: isCurrentSong ? colors.primary : colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.artists?.primary?.[0]?.name || 'Unknown Artist'}
          </Text>
        </View>
        <TouchableOpacity style={styles.songMoreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={playlistSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.playlistHeader}>
            <Image source={{ uri: imageUrl }} style={styles.playlistImage} />
            <Text style={[styles.playlistName, { color: colors.text }]}>{name}</Text>
            <Text style={[styles.playlistMeta, { color: colors.textSecondary }]}>
              {playlistSongs.length} songs
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.playButton, { backgroundColor: colors.primary }]}
                onPress={handlePlayAll}
              >
                <Ionicons name="play" size={24} color="#fff" />
                <Text style={styles.playButtonText}>Play All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.shuffleButton, { backgroundColor: isShuffleActive ? colors.primary : colors.card }]}
                onPress={handleShuffle}
              >
                <Ionicons name="shuffle" size={24} color={isShuffleActive ? '#fff' : colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playlistHeader: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  playlistImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  playlistMeta: {
    fontSize: 16,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shuffleButton: {
    padding: 12,
    borderRadius: 24,
  },
  listContent: {
    paddingBottom: 100,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  songCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
  },
  songMoreButton: {
    padding: 8,
  },
});

export default PlaylistDetails;
