import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { RootStackParamList } from '../types/navigation';
import { useAudioPlayer } from './useAudioPlayer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useSongActions = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { loadTrack } = useAudioPlayer();
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [isSongInfoVisible, setIsSongInfoVisible] = useState(false);

  const getAudioUrl = (song: any) => {
    if (!song.downloadUrl) return '';
    // Prefer 320kbps, then 160kbps, then others
    const qualities = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
    for (const quality of qualities) {
      const match = song.downloadUrl.find((url: any) => url.quality === quality);
      if (match) return match.url;
    }
    return song.downloadUrl[0]?.url || '';
  };

  const getImageUrl = (song: any, quality: string = '500x500') => {
    if (!song.image) return 'https://picsum.photos/200/200';
    const match = song.image.find((img: any) => img.quality === quality);
    if (match) return match.url;
    // Fallback to highest quality if specific not found
    return song.image[song.image.length - 1]?.url || 'https://picsum.photos/200/200';
  };

  const getArtistName = (song: any) => {
    if (!song.artists?.primary) return 'Unknown Artist';
    return song.artists.primary.map((a: any) => a.name).join(', ');
  };

  const playSong = useCallback(async (song: any) => {
    const audioUrl = getAudioUrl(song);
    const coverUrl = getImageUrl(song);
    const artist = getArtistName(song);

    if (!audioUrl) {
      console.warn('No audio URL found for song:', song.name);
      return;
    }

    await loadTrack({
      id: song.id,
      title: song.name,
      artist,
      coverUrl,
      audioUrl,
      duration: typeof song.duration === 'string' ? parseInt(song.duration) : song.duration,
      data: song,
    });

    navigation.navigate('Player', {
      songId: song.id,
    });
  }, [loadTrack, navigation, dispatch]);

  const openSongInfo = (song: any) => {
    setSelectedSong(song);
    setIsSongInfoVisible(true);
  };

  const closeSongInfo = () => {
    setIsSongInfoVisible(false);
    setSelectedSong(null);
  };

  return {
    playSong,
    openSongInfo,
    closeSongInfo,
    selectedSong,
    isSongInfoVisible,
    getImageUrl,
    getArtistName,
  };
};
