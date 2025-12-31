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
    View
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAppSelector } from '../../../store/hooks';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ArtistScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { history } = useAppSelector((state) => state.library);

  const artists = useMemo(() => {
    const artistMap = new Map();
    
    // Iterate through history to find unique artists
    history.forEach(item => {
      if (item.type === 'song' && item.data?.artists?.primary) {
        item.data.artists.primary.forEach((artist: any) => {
          if (!artistMap.has(artist.id)) {
            // Find best image (prefer 150x150)
            const image = artist.image?.find((img: any) => img.quality === '150x150')?.url 
              || artist.image?.[0]?.url 
              || 'https://picsum.photos/200/200';

            artistMap.set(artist.id, {
              id: artist.id,
              name: artist.name,
              image: image,
            });
          }
        });
      }
    });

    return Array.from(artistMap.values());
  }, [history]);

  const handleArtistPress = (artist: any) => {
    navigation.navigate('ArtistDetails', {
      artistId: artist.id,
      name: artist.name,
      albums: 0,
      songs: 0,
      imageUrl: artist.image,
    });
  };

  const renderArtistItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={styles.artistItem}
        onPress={() => handleArtistPress(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image }} style={styles.artistImage} />
        <View style={styles.artistInfo}>
          <Text style={[styles.artistName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.artistMeta, { color: colors.textSecondary }]}>
            Artist
          </Text>
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
        <Text style={[styles.count, { color: colors.text }]}>{artists.length} artists</Text>
        
      </View>
      <FlatList
        data={artists}
        renderItem={renderArtistItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Start exploring to find artists!</Text>
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
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  artistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistMeta: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default ArtistScreen;
