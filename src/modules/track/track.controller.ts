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
import { Track } from '../../interfaces/track.interface';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { BaseResponse } from 'src/utils/base.response.util';

@Controller('track')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Get()
  async getAll(): Promise<BaseResponse<Track[]>> {
     let result= await this.trackService.getAll();
     return BaseResponse.success(result)
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponse<Track>> {
    let result= await this.trackService.get(id);
    return BaseResponse.success(result)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createTrack(@Body() data: CreateTrackDto): Promise<BaseResponse<Track>> {
    let result= await this.trackService.create(data);
    return BaseResponse.success(result)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateTrackDto,
  ): Promise<BaseResponse<Track>> {
    let result= await this.trackService.update(id, data);
    return BaseResponse.success(result)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpecific(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponse<boolean>> {
    const result = await this.trackService.delete(id);
    await this.favoriteService.remove(id, 'tracks').catch(() => true);
    return BaseResponse.success(result);
  }
}
