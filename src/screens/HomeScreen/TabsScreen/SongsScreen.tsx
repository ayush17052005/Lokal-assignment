import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Songinfo from '../../../components/Songs/Songinfo';
import { useTheme } from '../../../context/ThemeContext';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SongsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedSong, setSelectedSong] = useState<typeof songs[0] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const songs = [
    { id: '1', title: 'Starboy', artist: 'The Weeknd, Daft Punk', duration: '03:50', cover: 'https://picsum.photos/200/200?random=1' },
    { id: '2', title: 'Disaster', artist: 'Conan Gray', duration: '03:58', cover: 'https://picsum.photos/200/200?random=2' },
    { id: '3', title: 'HANDSOME', artist: 'Warren Hue', duration: '04:45', cover: 'https://picsum.photos/200/200?random=3' },
    { id: '4', title: 'Sharks', artist: 'Imagine Dragons', duration: '06:23', cover: 'https://picsum.photos/200/200?random=4' },
    { id: '5', title: 'Fly Me To The Sun', artist: 'Romantic Echoes', duration: '04:20', cover: 'https://picsum.photos/200/200?random=5' },
    { id: '6', title: 'The Bended Man', artist: 'Sunwich', duration: '03:48', cover: 'https://picsum.photos/200/200?random=6' },
  ];

  const handlePlaySong = (song: typeof songs[0]) => {
    navigation.navigate('Player', {
      songId: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.cover,
      duration: song.duration,
    });
  };

  const handleMorePress = (song: typeof songs[0]) => {
    setSelectedSong(song);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedSong(null);
  };

  const renderSongItem = ({ item }: { item: typeof songs[0] }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handlePlaySong(item)}>
      <Image source={{ uri: item.cover }} style={styles.songCover} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artist} | {item.duration} mins
        </Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => handlePlaySong(item)}>
        <Ionicons name="play-circle" size={40} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton} onPress={() => handleMorePress(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.count, { color: colors.text }]}>560 songs</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: colors.primary }]}>Ascending</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      {selectedSong && (
        <Songinfo
          isVisible={isModalVisible}
          onClose={handleCloseModal}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  songCover: {
    width: 80,
    height: 80,
    borderRadius: 15,
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
    fontSize: 13,
  },
  playButton: {
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
});

export default SongsScreen;
