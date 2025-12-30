import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ArtistInfoProps {
  isVisible: boolean;
  onClose: () => void;
  artist: {
    id: string;
    name: string;
    albums: number;
    songs: number;
    image: string;
  };
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ isVisible, onClose, artist }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const menuOptions = [
    { id: 'play', icon: 'play-circle-outline', label: 'Play' },
    { id: 'play-next', icon: 'play-forward-outline', label: 'Play Next' },
    { id: 'add-queue', icon: 'list-outline', label: 'Add to Playing Queue' },
    { id: 'add-playlist', icon: 'add-circle-outline', label: 'Add to Playlist' },
    { id: 'share', icon: 'share-outline', label: 'Share' },
  ];

  const handleOptionPress = (optionId: string) => {
    console.log('Option pressed:', optionId);
    onClose();
  };

  const handleHeaderPress = () => {
    onClose();
    navigation.navigate('ArtistDetails', {
      artistId: artist.id,
      name: artist.name,
      albums: artist.albums,
      songs: artist.songs,
      imageUrl: artist.image,
    });
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Handle Bar */}
        <View style={styles.handleBar} />

        {/* Artist Header - Clickable */}
        <TouchableOpacity 
          style={styles.header}
          onPress={handleHeaderPress}
          activeOpacity={0.7}
        >
          <Image source={{ uri: artist.image }} style={styles.artistImage} />
          <View style={styles.artistInfo}>
            <Text style={[styles.artistName, { color: colors.text }]}>
              {artist.name}
            </Text>
            <Text style={[styles.artistStats, { color: colors.textSecondary }]}>
              {artist.albums} Album | {artist.songs} Songs
            </Text>
          </View>
        </TouchableOpacity>

        {/* Menu Options */}
        <ScrollView
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.menuItem}
              onPress={() => handleOptionPress(option.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={colors.text}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuLabel, { color: colors.text }]}>
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
    paddingTop: 8,
    maxHeight: '70%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#888',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  artistStats: {
    fontSize: 14,
  },
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    flex: 1,
  },
});

export default ArtistInfo;