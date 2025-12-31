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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArtistById } from '../../api/hooks';
import { Album, Artist, Song } from '../../api/types';
import Songinfo from '../../components/Songs/Songinfo';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer } from '../../hooks';
import { Track } from '../../store/slices/playerSlice';
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
  const insets = useSafeAreaInsets();
  const { artistId, name, albums, songs, imageUrl } = route.params;
  
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSongInfoVisible, setIsSongInfoVisible] = useState(false);

  const { playAlbum, currentTrack, isPlaying, shuffleQueue } = useAudioPlayer();
  const { data: artistData, isLoading } = useArtistById(artistId);

  const artist = artistData?.data;
  const topSongs = artist?.topSongs || [];
  const topAlbums = artist?.topAlbums || [];
  const singles = artist?.singles || [];
  const similarArtists = artist?.similarArtists || [];

  const getTrackFromSong = (song: Song): Track => {
    const artistName = song.artists?.primary?.[0]?.name || artist?.name || name;
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
    const tracks = topSongs.map(getTrackFromSong);
    await playAlbum(tracks, index);
    navigation.navigate('Player', { songId: tracks[index].id });
  };

  const handleShuffle = () => {
    const tracks = topSongs.map(getTrackFromSong);
    playAlbum(tracks, 0).then(() => {
        shuffleQueue();
        setIsShuffleActive(true);
    });
  };

  const handlePlayAll = () => {
    const tracks = topSongs.map(getTrackFromSong);
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
        <Image source={{ uri: item.image?.[0]?.url || imageUrl }} style={styles.songCover} />
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: isCurrentSong ? colors.primary : colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.artists?.primary?.[0]?.name || artist?.name || name}
          </Text>
        </View>
        <TouchableOpacity style={styles.songMoreButton} onPress={() => handleSongOptions(item)}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderAlbumItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => navigation.push('AlbumDetails', {
        albumId: item.id,
        name: item.name,
        artist: artist?.name || name,
        year: item.year?.toString() || '',
        songs: item.songCount || 0,
        imageUrl: item.image?.[item.image.length - 1]?.url || '',
      })}
    >
      <Image source={{ uri: item.image?.[item.image.length - 1]?.url }} style={styles.albumCover} />
      <Text style={[styles.albumTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
      <Text style={[styles.albumYear, { color: colors.textSecondary }]}>{item.year}</Text>
    </TouchableOpacity>
  );

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.similarArtistItem}
      onPress={() => navigation.push('ArtistDetails', {
        artistId: item.id,
        name: item.name,
        albums: 0,
        songs: 0,
        imageUrl: item.image?.[item.image.length - 1]?.url || '',
      })}
    >
      <Image source={{ uri: item.image?.[item.image.length - 1]?.url }} style={styles.similarArtistImage} />
      <Text style={[styles.similarArtistName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

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
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Artist Cover & Info */}
        <View style={styles.artistSection}>
          <Image 
            source={{ uri: artist?.image?.[artist.image.length - 1]?.url || imageUrl }} 
            style={styles.artistCover} 
          />
          <Text style={[styles.artistName, { color: colors.text }]}>{artist?.name || name}</Text>
          <Text style={[styles.artistMeta, { color: colors.textSecondary }]}>
            {artist?.followerCount 
              ? `${Number(artist.followerCount).toLocaleString()} Followers` 
              : (albums > 0 || songs > 0) ? `${albums} Albums | ${songs} Songs` : 'Artist'}
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

        {/* Top Songs Section */}
        {topSongs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Songs</Text>
            </View>
            <FlatList
              data={topSongs}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Top Albums Section */}
        {topAlbums.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Albums</Text>
            </View>
            <FlatList
              data={topAlbums}
              renderItem={renderAlbumItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Singles Section */}
        {singles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Singles</Text>
            </View>
            <FlatList
              data={singles}
              renderItem={renderAlbumItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Similar Artists Section */}
        {similarArtists.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Similar Artists</Text>
            </View>
            <FlatList
              data={similarArtists}
              renderItem={renderArtistItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}
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
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  searchButton: {
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
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  artistName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  artistMeta: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
  },
  songMoreButton: {
    padding: 8,
  },
  horizontalList: {
    paddingRight: 20,
  },
  albumItem: {
    marginRight: 16,
    width: 140,
  },
  albumCover: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumYear: {
    fontSize: 12,
  },
  similarArtistItem: {
    marginRight: 16,
    width: 100,
    alignItems: 'center',
  },
  similarArtistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  similarArtistName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ArtistDetails;