import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateArtistDto {
  @ValidateIf((o) => o.grammy == undefined || o.name)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((o) => !o.name || o.grammy)
  @IsBoolean()
  grammy: boolean;
}
