import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useArtistAlbums } from '../../../api/hooks';
import { useTheme } from '../../../context/ThemeContext';
import { useAppSelector } from '../../../store/hooks';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AlbumsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { history } = useAppSelector((state) => state.library);
  const recentlyPlayed = history.filter(item => item.type === 'song');
  const lastPlayedSongData = recentlyPlayed[0]?.data;
  const lastArtistId = lastPlayedSongData?.artists?.primary?.[0]?.id || '';

  const { data: albumsData, isLoading } = useArtistAlbums(lastArtistId, undefined, {
    enabled: !!lastArtistId,
  });

  const albums = albumsData?.data?.albums || [];

  const handleAlbumPress = (album: any) => {
    console.log(album.id)
    navigation.navigate('AlbumDetails', {
      albumId: album.id,
      name: album.name,
      artist: album.primaryArtists || 'Unknown Artist',
      year: album.year || '',
      songs: album.songCount || 0,
      imageUrl: album.image?.[2]?.url || album.image?.[0]?.url || 'https://picsum.photos/300/300',
    });
  };

  const renderAlbumItem = ({ item, index }: { item: any; index: number }) => {
    const imageUrl = item.image?.find((img: any) => img.quality === '500x500')?.url || 
                     item.image?.[0]?.url || 
                     'https://picsum.photos/300/300';

    return (
      <TouchableOpacity 
        style={[styles.albumItem, index % 2 === 0 && styles.albumItemLeft]}
        onPress={() => handleAlbumPress(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUrl }} style={styles.albumCover} />
        <View style={styles.albumInfo}>
          <View>
          <Text style={[styles.albumTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.albumMeta, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.year}
          </Text>
          <Text style={[styles.albumSongs, { color: colors.textSecondary }]}>
            {item.songCount || 0} songs
          </Text>
          </View>
          <View>
              <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={15} color={colors.textSecondary} />
        </TouchableOpacity>
          </View>
        </View>
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
        <Text style={[styles.count, { color: colors.text }]}>{albums.length} albums</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: colors.primary }]}>Recommended</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={albums}
        renderItem={renderAlbumItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {lastArtistId ? 'No albums found' : 'Play a song to get album recommendations'}
            </Text>
          </View>
        }
      />
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
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  albumItem: {
    width: '48%',
    marginBottom: 20,
  },
  albumItemLeft: {
    marginRight: '4%',
  },
  albumCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  albumInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    width: 120,
  },
  albumMeta: {
    fontSize: 12,
    marginBottom: 2,
  },
  albumSongs: {
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default AlbumsScreen;
