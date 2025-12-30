import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useAlbumActions = () => {
  const navigation = useNavigation<NavigationProp>();

  const openAlbumDetails = (album: any) => {
    navigation.navigate('AlbumDetails', {
      albumId: album.id,
      name: album.name,
      artist: album.artists?.primary?.[0]?.name || 'Unknown Artist',
      year: album.year || '',
      songs: album.songCount || 0,
      imageUrl: getImageUrl(album),
    });
  };

  const getImageUrl = (album: any, quality: string = '500x500') => {
    if (!album.image) return 'https://picsum.photos/200/200';
    const match = album.image.find((img: any) => img.quality === quality);
    return match ? match.url : album.image[0]?.url || 'https://picsum.photos/200/200';
  };

  return {
    openAlbumDetails,
    getImageUrl,
  };
};
