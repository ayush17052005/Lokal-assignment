import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ArtistInfo from '../../../components/Artists/ArtistInfo';
import { useTheme } from '../../../context/ThemeContext';

const ArtistScreen = () => {
  const { colors } = useTheme();
  const [selectedArtist, setSelectedArtist] = useState<typeof artists[0] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const artists = [
    { id: '1', name: 'Ariana Grande', albums: 1, songs: 20, image: 'https://picsum.photos/200/200?random=10' },
    { id: '2', name: 'The Weeknd', albums: 1, songs: 16, image: 'https://picsum.photos/200/200?random=11' },
    { id: '3', name: 'Acidrap', albums: 2, songs: 28, image: 'https://picsum.photos/200/200?random=12' },
    { id: '4', name: 'Ania Szarmarch', albums: 1, songs: 12, image: 'https://picsum.photos/200/200?random=13' },
    { id: '5', name: 'Troye Sivan', albums: 1, songs: 14, image: 'https://picsum.photos/200/200?random=14' },
    { id: '6', name: 'Ryan Jones', albums: 2, songs: 24, image: 'https://picsum.photos/200/200?random=15' },
  ];

  const handleArtistPress = (artist: typeof artists[0]) => {
    setSelectedArtist(artist);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedArtist(null);
  };

  const renderArtistItem = ({ item }: { item: typeof artists[0] }) => (
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
          {item.albums} Album | {item.songs} Songs
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.count, { color: colors.text }]}>85 artists</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: colors.primary }]}>Date Added</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={artists}
        renderItem={renderArtistItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      {selectedArtist && (
        <ArtistInfo
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          artist={selectedArtist}
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
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  artistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  artistMeta: {
    fontSize: 13,
  },
});

export default ArtistScreen;
