import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AlbumsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const albums = [
    { id: '1', title: 'Dawn FM', artist: 'The Weeknd', year: 2022, songs: 16, cover: 'https://picsum.photos/300/300?random=20' },
    { id: '2', title: 'Sweetener', artist: 'Ariana Grande', year: 2021, songs: 16, cover: 'https://picsum.photos/300/300?random=21' },
    { id: '3', title: 'First Impact', artist: 'Treasure', year: 2021, songs: 14, cover: 'https://picsum.photos/300/300?random=22' },
    { id: '4', title: 'Pain (Official)', artist: 'Ryan Jones', year: 2021, songs: 18, cover: 'https://picsum.photos/300/300?random=23' },
  ];

  const handleAlbumPress = (album: typeof albums[0]) => {
    navigation.navigate('AlbumDetails', {
      albumId: album.id,
      name: album.title,
      artist: album.artist,
      year: album.year.toString(),
      songs: album.songs,
      imageUrl: album.cover,
    });
  };

  const renderAlbumItem = ({ item, index }: { item: typeof albums[0]; index: number }) => (
    <TouchableOpacity 
      style={[styles.albumItem, index % 2 === 0 && styles.albumItemLeft]}
      onPress={() => handleAlbumPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.cover }} style={styles.albumCover} />
      <View style={styles.albumInfo}>
        <View>
        <Text style={[styles.albumTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.albumMeta, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artist} | {item.year}
        </Text>
        <Text style={[styles.albumSongs, { color: colors.textSecondary }]}>
          {item.songs} songs
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.count, { color: colors.text }]}>68 albums</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: colors.primary }]}>Date Modified</Text>
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
    paddingHorizontal: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  albumItem: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  albumItemLeft: {
    marginRight: 8,
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
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
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
});

export default AlbumsScreen;
