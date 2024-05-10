import {
  IsInt,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { UuidOrNull } from '../../../utils/IdUuidOrNull';

export class UpdateAlbumDto {
  @ValidateIf((o) => o.year == undefined || o.name)
  @IsString()
  name?: string;

  @ValidateIf((o) => o.name == undefined || o.year)
  @IsInt()
  year?: number;

  @IsOptional()
  @Validate(UuidOrNull, { message: 'artistId must be UUIDv4 or null' })
  artistId?: string | null;
}
