import {
  IsInt,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { UuidOrNull } from '../../../utils/IdUuidOrNull';

export class UpdateTrackDto {
  @ValidateIf((o) => o.duration == undefined || o.name)
  @IsString()
  name?: string;

  @IsOptional()
  @Validate(UuidOrNull, { message: 'artistId must be UUIDv4 or null' })
  artistId?: string | null;

  @IsOptional()
  @Validate(UuidOrNull, { message: 'albumId must be UUIDv4 or null' })
  albumId?: string | null;

  @ValidateIf((o) => o.name == undefined || o.duration)
  @IsInt()
  duration?: number;
}
