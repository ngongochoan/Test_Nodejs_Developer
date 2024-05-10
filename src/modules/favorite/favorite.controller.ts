import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoritesCollection } from '../../interfaces/favorites-collection.interface';
import { FavoriteType } from '../../interfaces/types';
import { BaseResponse } from 'src/utils/base.response.util';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async getAll(): Promise<BaseResponse<FavoritesCollection>> {
    let data= await  this.favoriteService.getAll();
    return BaseResponse.success(data)
  }

  @Post('/:type/:id')
  async addFav(
    @Param('type') type: StringConstructor,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.favoriteService.add(id, `${type}s` as FavoriteType);
  }

  @Delete('/:type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFav(
    @Param('type') type: StringConstructor,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FavoritesCollection> {
    return this.favoriteService.remove(id, `${type}s` as FavoriteType);
  }
}
