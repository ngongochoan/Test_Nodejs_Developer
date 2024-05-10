import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  oldPassword: string; // previous password

  @IsString()
  @MinLength(6)
  newPassword: string; // new password
}
