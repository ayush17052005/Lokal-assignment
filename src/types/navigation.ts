export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: string };
  Player: {
    songId: string;
    title: string;
    artist: string;
    coverUrl: string;
    duration?: string;
  };
  ArtistDetails: {
    artistId: string;
    name: string;
    albums: number;
    songs: number;
    imageUrl: string;
  };
  Search: undefined;
};
