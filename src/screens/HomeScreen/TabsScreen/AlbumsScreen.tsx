import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAppSelector } from '../../../store/hooks';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AlbumsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { history } = useAppSelector((state) => state.library);

  const albums = useMemo(() => {
    const albumMap = new Map();
    
    // Iterate through history to find unique albums
    history.forEach(item => {
      if (item.type === 'song' && item.data?.album) {
        const albumId = item.data.album.id;
        if (!albumMap.has(albumId)) {
          // Use song image as album cover since song object has it
          const imageUrl = item.data.image?.find((img: any) => img.quality === '500x500')?.url || 
                           item.data.image?.[0]?.url || 
                           'https://picsum.photos/300/300';

          albumMap.set(albumId, {
            id: albumId,
            name: item.data.album.name,
            artist: item.data.artists?.primary?.[0]?.name || 'Unknown Artist',
            year: item.data.year || '',
            songCount: 1, // We don't have total count from song object, but that's okay
            image: [{ url: imageUrl }], // Mock image structure to match renderItem expectation
          });
        }
      }
    });

    return Array.from(albumMap.values());
  }, [history]);

  const handleAlbumPress = (album: any) => {
    navigation.navigate('AlbumDetails', {
      albumId: album.id,
      name: album.name,
      artist: album.artist,
      year: album.year,
      songs: album.songCount,
      imageUrl: album.image?.[0]?.url,
    });
  };

  const renderAlbumItem = ({ item, index }: { item: any; index: number }) => {
    const imageUrl = item.image?.[0]?.url;

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
            {item.artist} • {item.year}
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

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.count, { color: colors.text }]}>{albums.length} albums</Text>
        
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
              Play songs to see albums here
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
