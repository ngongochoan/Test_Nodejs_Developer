import { IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { UuidOrNull } from '../../../utils/IdUuidOrNull';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @Validate(UuidOrNull, { message: 'artistId must be UUIDv4 or null' })
  artistId: string | null;

  @IsOptional()
  @Validate(UuidOrNull, { message: 'albumId must be UUIDv4 or null' })
  albumId: string | null;

  @IsInt()
  duration: number;
}
