import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ArtistInfo from '../../../components/Artists/ArtistInfo';
import { useTheme } from '../../../context/ThemeContext';
import { useSongActions } from '../../../hooks';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SuggestionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { playSong } = useSongActions();
  const [selectedArtist, setSelectedArtist] = useState<typeof artists[0] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const recentlyPlayed = [
    { id: '1', title: 'Shades of Love', artist: 'Ania Szarmach', duration: '03:25', cover: 'https://picsum.photos/200/200?random=1' },
    { id: '2', title: 'Without You', artist: 'The Kid LAROI', duration: '02:50', cover: 'https://picsum.photos/200/200?random=2' },
    { id: '3', title: 'Save Your Tears', artist: 'The Weeknd', duration: '03:35', cover: 'https://picsum.photos/200/200?random=3' },
  ];

  const artists = [
    { id: '1', name: 'Ariana Grande', albums: 1, songs: 20, image: 'https://picsum.photos/200/200?random=4' },
    { id: '2', name: 'The Weeknd', albums: 1, songs: 16, image: 'https://picsum.photos/200/200?random=5' },
    { id: '3', name: 'Acidrap', albums: 2, songs: 28, image: 'https://picsum.photos/200/200?random=6' },
  ];

  const mostPlayed = [
    { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', duration: '03:20', cover: 'https://picsum.photos/200/200?random=7' },
    { id: '5', title: 'Levitating', artist: 'Dua Lipa', duration: '03:23', cover: 'https://picsum.photos/200/200?random=8' },
    { id: '6', title: 'As It Was', artist: 'Harry Styles', duration: '02:47', cover: 'https://picsum.photos/200/200?random=9' },
  ];

  const handlePlaySong = (song: typeof recentlyPlayed[0]) => {
    // Convert to format expected by playSong
    playSong({
      id: song.id,
      name: song.title,
      duration: song.duration, // This might need parsing if it's "MM:SS"
      downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }], // Dummy URL for testing
      image: [{ quality: '500x500', url: song.cover }],
      artists: { primary: [{ name: song.artist }] }
    });
  };

  const handleArtistPress = (artist: typeof artists[0]) => {
    setSelectedArtist(artist);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedArtist(null);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Recently Played */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recently Played
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyPlayed.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.songCard, index === 0 && styles.firstCard]}
              onPress={() => handlePlaySong(item)}
            >
              <Image
                source={{ uri: item.cover }}
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
                {item.artist}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Artists */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Artists</Text>
           <TouchableOpacity
              activeOpacity={0.7}
            >
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {artists.map((artist, index) => (
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
      </View>

      {/* Most Played */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Most Played
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mostPlayed.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePlaySong(item)}
              style={[styles.songCard, index === 0 && styles.firstCard]}
            >
              <Image
                source={{ uri: item.cover }}
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
                {item.artist}
              </Text>
            </TouchableOpacity>
          ))}

      {selectedArtist && (
        <ArtistInfo
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          artist={selectedArtist}
        />
      )}
        </ScrollView>
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
});

export default SuggestionScreen;