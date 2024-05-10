import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Favorites } from '../../interfaces/favorites.interface';
import { favData } from '../../database/favorites.data';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesCollection } from '../../interfaces/favorites-collection.interface';
import { FavoriteType } from '../../interfaces/types';

@Injectable()
export class FavoriteService {
  private readonly favs: Favorites;

  @Inject()
  private readonly artistService: ArtistService;

  @Inject()
  private readonly albumService: AlbumService;

  @Inject()
  private readonly trackService: TrackService;

  constructor() {
    this.favs = favData;
  }

  async getAll(): Promise<FavoritesCollection> {
    const favs = this.favs;
    const returnData: FavoritesCollection = {
      artists: [],
      albums: [],
      tracks: [],
    };

    for (const favType in favs) {
      returnData[favType] = await this.addCollection(
        favType as FavoriteType,
        favs[favType],
      );
    }

    return returnData;
  }

  async add(id: string, type: FavoriteType): Promise<FavoritesCollection> {
    const provider = this.getProvider(type);
    try {
      await provider.get(id);
    } catch (err: unknown) {
      throw new HttpException(
        (err as Error).message,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!this.favs[type].includes(id)) {
      this.favs[type].push(id);
    }

    return this.getAll();
  }

  async remove(id: string, type: FavoriteType): Promise<FavoritesCollection> {
    const itemIdx = this.favs[type].findIndex((item) => item === id);

    if (itemIdx === -1) {
      throw new NotFoundException(`Favourite item not found in ${type}`);
    }

    this.favs[type].splice(itemIdx, 1);
    return this.getAll();
  }

  private getProvider(
    type: FavoriteType,
  ): ArtistService | AlbumService | TrackService {
    let provider: ArtistService | AlbumService | TrackService | null = null;

    switch (type) {
      case 'artists':
        provider = this.artistService;
        break;
      case 'albums':
        provider = this.albumService;
        break;
      case 'tracks':
        provider = this.trackService;
        break;
      default:
        throw new BadGatewayException();
    }

    return provider;
  }

  private async addCollection(type: FavoriteType, favs: string[]) {
    const provider: ArtistService | AlbumService | TrackService =
      this.getProvider(type);

    const promises = [];

    for (const id of favs) {
      promises.push(
        provider.get(id).catch(() => {
          return false;
        }),
      );
    }

    const result = await Promise.all(promises);

    return result.filter((item) => item);
  }
}
