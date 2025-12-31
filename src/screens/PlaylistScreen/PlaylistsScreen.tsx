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
import { useSearchPlaylists } from '../../api/hooks';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PlaylistsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { data: playlistsData, isLoading } = useSearchPlaylists({ query: 'Trending', limit: 20 });
  const playlists = playlistsData?.data?.results || [];

  const handlePlaylistPress = (playlist: any) => {
    navigation.navigate('PlaylistDetails', {
      playlistId: playlist.id,
      name: playlist.title || playlist.name,
      imageUrl: playlist.image?.[2]?.url || playlist.image?.[0]?.url || 'https://picsum.photos/300/300',
    });
  };

  const renderPlaylistItem = ({ item, index }: { item: any; index: number }) => {
    const imageUrl = item.image?.find((img: any) => img.quality === '500x500')?.url || 
                     item.image?.[0]?.url || 
                     'https://picsum.photos/300/300';

    return (
      <TouchableOpacity 
        style={[styles.playlistItem, index % 2 === 0 && styles.playlistItemLeft]}
        onPress={() => handlePlaylistPress(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUrl }} style={styles.playlistCover} />
        <View style={styles.playlistInfo}>
          <Text style={[styles.playlistTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title || item.name}
          </Text>
          <Text style={[styles.playlistMeta, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.subtitle || 'Playlist'}
          </Text>
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
        <Text style={[styles.count, { color: colors.text }]}>{playlists.length} playlists</Text>
      </View>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No playlists found
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  playlistItem: {
    width: '48%',
    marginBottom: 20,
  },
  playlistItemLeft: {
    marginRight: '4%',
  },
  playlistCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  playlistInfo: {
    gap: 4,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  playlistMeta: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default PlaylistsScreen;
