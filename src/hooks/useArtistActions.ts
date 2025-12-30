import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useArtistActions = () => {
  const navigation = useNavigation<NavigationProp>();

  const openArtistDetails = (artist: any) => {
    navigation.navigate('ArtistDetails', {
      artistId: artist.id,
      name: artist.name,
      albums: 0, // Placeholder
      songs: 0, // Placeholder
      imageUrl: getImageUrl(artist),
    });
  };

  const getImageUrl = (artist: any, quality: string = '500x500') => {
    if (!artist.image) return 'https://picsum.photos/200/200';
    const match = artist.image.find((img: any) => img.quality === quality);
    return match ? match.url : artist.image[0]?.url || 'https://picsum.photos/200/200';
  };

  return {
    openArtistDetails,
    getImageUrl,
  };
};
