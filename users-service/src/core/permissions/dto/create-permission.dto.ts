import { Transform } from 'class-transformer';
import { IsString, Length, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @Length(3, 150)
  @Transform((data) => data.value.toLowerCase())
  permission_name: string;

  @IsString()
  @MaxLength(150)
  @Transform((data) => data.value.toLowerCase())
  description: string;
}
