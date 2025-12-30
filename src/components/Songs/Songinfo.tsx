import { Ionicons } from '@expo/vector-icons';
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

interface SongInfoProps {
  isVisible: boolean;
  onClose: () => void;
  song: {
    id: string;
    title: string;
    artist: string;
    duration: string;
    cover: string;
  };
}

const Songinfo: React.FC<SongInfoProps> = ({ isVisible, onClose, song }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

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
    // Handle option actions here
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
          <Image source={{ uri: song.cover }} style={styles.coverImage} />
          <View style={styles.songDetails}>
            <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={[styles.songMeta, { color: colors.textSecondary }]} numberOfLines={1}>
              {song.artist} | {song.duration} mins
            </Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={28} color={colors.text} />
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