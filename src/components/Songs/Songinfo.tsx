import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleLike } from '../../store/slices/librarySlice';
import { Track } from '../../store/slices/playerSlice';
import { RootStackParamList } from '../../types/navigation';

interface SongInfoProps {
  isVisible: boolean;
  onClose: () => void;
  song: {
    id: string;
    name?: string;
    title?: string;
    artist?: string;
    artists?: {
      primary?: Array<{ name: string; id?: string }>;
    };
    primaryArtists?: string;
    album?: { id: string; name: string };
    duration?: number | string;
    cover?: string;
    image?: Array<{ quality: string; url: string }>;
    downloadUrl?: Array<{ quality: string; url: string }>;
    url?: string;
    data?: any;
  };
}

const Songinfo: React.FC<SongInfoProps> = ({ isVisible, onClose, song }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addTrackToQueue, playTrackNext } = useAudioPlayer();
  const { likedSongs } = useAppSelector((state) => state.library);

  const isLiked = likedSongs.some(item => item.id === song.id);

  // Helper functions to get song details
  const getSongTitle = () => song.name || song.title || 'Unknown';
  const getArtistName = () => {
    if (song.artist) return song.artist;
    return song.artists?.primary?.[0]?.name || song.primaryArtists || 'Unknown Artist';
  };
  const getCoverUrl = () => {
    if (song.cover) return song.cover;
    return song.image?.find((img) => img.quality === '500x500')?.url ||
           song.image?.[0]?.url ||
           'https://picsum.photos/200/200';
  };
  const getDuration = () => {
    if (typeof song.duration === 'string') return song.duration;
    if (typeof song.duration === 'number') {
      const mins = Math.floor(song.duration / 60);
      const secs = song.duration % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return '00:00';
  };

  const getTrack = (): Track => {
      const audioUrl = song.downloadUrl?.find(url => url.quality === '320kbps')?.url || 
                       song.downloadUrl?.[song.downloadUrl.length - 1]?.url || 
                       song.url || '';
      
      return {
          id: song.id,
          title: getSongTitle(),
          artist: getArtistName(),
          coverUrl: getCoverUrl(),
          audioUrl: audioUrl,
          duration: typeof song.duration === 'number' ? song.duration : 0,
          data: song.data || song,
      };
  };

  const handleToggleLike = () => {
    const track = getTrack();
    dispatch(toggleLike({
      id: track.id,
      type: 'song',
      title: track.title,
      subtitle: track.artist,
      image: track.coverUrl,
      timestamp: Date.now(),
      data: track.data || {},
    }));
  };

  const menuOptions = [
    { id: 'play-next', icon: 'play-forward-outline', label: 'Play Next' },
    { id: 'add-queue', icon: 'list-outline', label: 'Add to Playing Queue' },
    { id: 'add-playlist', icon: 'add-circle-outline', label: 'Add to Playlist' },
    { id: 'go-album', icon: 'disc-outline', label: 'Go to Album' },
    { id: 'go-artist', icon: 'person-outline', label: 'Go to Artist' },
    { id: 'details', icon: 'information-circle-outline', label: 'Details' },
    { id: 'ringtone', icon: 'call-outline', label: 'Set as Ringtone' },
    { id: 'blacklist', icon: 'close-circle-outline', label: 'Add to Blacklist' },
    { id: 'share', icon: 'share-outline', label: 'Share' },
    { id: 'delete', icon: 'trash-outline', label: 'Delete from Device' },
  ];

  const handleOptionPress = (optionId: string) => {
    console.log('Option pressed:', optionId);
    const track = getTrack();
    
    switch (optionId) {
        case 'play-next':
            playTrackNext(track);
            break;
        case 'add-queue':
            addTrackToQueue(track);
            break;
        case 'go-album':
            const album = song.album || song.data?.album;
            if (album?.id) {
                onClose();
                navigation.navigate('AlbumDetails', {
                    albumId: album.id,
                    name: album.name || 'Unknown Album',
                    artist: getArtistName(),
                    year: '',
                    songs: 0,
                    imageUrl: getCoverUrl(),
                });
                return;
            }
            break;
        case 'go-artist':
             const artists = song.artists || song.data?.artists;
             const artistId = artists?.primary?.[0]?.id;
             if (artistId) {
                 onClose();
                 navigation.navigate('ArtistDetails', {
                     artistId: artistId,
                     name: getArtistName(),
                     albums: 0,
                     songs: 0,
                     imageUrl: getCoverUrl(),
                 });
                 return;
             }
            break;
        // Add other cases as needed
    }
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      propagateSwipe={true}
      backdropOpacity={0.5}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Handle Bar */}
        <View style={styles.handleBar}>
          <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />
        </View>

        {/* Song Header */}
        <View style={styles.songHeader}>
          <Image source={{ uri: getCoverUrl() }} style={styles.coverImage} />
          <View style={styles.songDetails}>
            <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
              {getSongTitle()}
            </Text>
            <Text style={[styles.songMeta, { color: colors.textSecondary }]} numberOfLines={1}>
              {getArtistName()} | {getDuration()} mins
            </Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleLike}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={isLiked ? colors.primary : colors.text} 
            />
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <ScrollView
          style={styles.optionsList}
          showsVerticalScrollIndicator={false}
        >
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index === menuOptions.length - 1 && styles.lastOption,
              ]}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon as any} size={24} color={colors.text} />
              </View>
              <Text style={[styles.optionLabel, { color: colors.text }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  songHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  songDetails: {
    flex: 1,
    marginLeft: 16,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  songMeta: {
    fontSize: 14,
  },
  favoriteButton: {
    padding: 8,
  },
  optionsList: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  lastOption: {
    paddingBottom: 8,
  },
  optionIcon: {
    width: 40,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
});

export default Songinfo;