import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsOptional()
  @IsString()
  @Length(3, 150)
  @Transform((data) => data.value.toLowerCase())
  permission_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform((data) => data.value.toLowerCase())
  description: string;
}
