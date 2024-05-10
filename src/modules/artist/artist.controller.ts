import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Artist } from '../../interfaces/artist.interface';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { BaseResponse } from 'src/utils/base.response.util';

@Controller('artist')
export class ArtistController {
  constructor(
    private artistService: ArtistService,
    private readonly trackService: TrackService,
    private readonly favoriteService: FavoriteService,
    private readonly albumService: AlbumService,
  ) {}
  @Get()
  async getAll(): Promise<BaseResponse<Artist[]>> {
    let data= await this.artistService.getAll()
    return BaseResponse.success( data);
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponse<Artist>> {
    let data= await this.artistService.get(id);
    return BaseResponse.success(data)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createArtist(@Body() data: CreateArtistDto): Promise<BaseResponse<Artist>> {
    let result= await this.artistService.create(data);
    return BaseResponse.success(result)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateArtistDto,
  ): Promise<BaseResponse<Artist>> {
    let result= await this.artistService.update(id, data);
    return BaseResponse.success(result)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponse<boolean>> {
    const result = await this.artistService.delete(id);
    await this.favoriteService.remove(id, 'artists').catch(() => true);
    let [albums, tracks] = await Promise.all([
      this.albumService.getAll(),
      this.trackService.getAll(),
    ]);
    tracks = tracks.filter((track) => track.artistId === id);
    albums = albums.filter((album) => album.artistId === id);

    if (tracks.length) {
      const promises = [];

      for (const track of tracks) {
        promises.push(this.trackService.update(track.id, { artistId: null }));
      }

      await Promise.all(promises);
    }

    if (albums.length) {
      const promises = [];

      for (const album of albums) {
        promises.push(this.albumService.update(album.id, { artistId: null }));
      }

      await Promise.all(promises);
    }

    return BaseResponse.success(result);
  }
}
