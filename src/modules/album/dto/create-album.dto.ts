import { IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { UuidOrNull } from '../../../utils/IdUuidOrNull';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsOptional()
  @Validate(UuidOrNull, { message: 'albumId must be UUIDv4 or null' })
  artistId: string;
}
