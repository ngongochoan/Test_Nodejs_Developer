import { Album } from './album.interface';
import { Artist } from './artist.interface';
import { Track } from './track.interface';

export interface FavoritesCollection {
  artists: Artist[]; // favorite artists
  albums: Album[]; // favorite albums ids
  tracks: Track[]; // favorite tracks ids
}
