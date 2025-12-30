export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: string };
  Player: {
    songId: string;
  };
  ArtistDetails: {
    artistId: string;
    name: string;
    albums: number;
    songs: number;
    imageUrl: string;
  };
  AlbumDetails: {
    albumId: string;
    name: string;
    artist: string;
    year: string;
    songs: number;
    imageUrl: string;
  };
  Search: undefined;
};
