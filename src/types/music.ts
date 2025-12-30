export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}
