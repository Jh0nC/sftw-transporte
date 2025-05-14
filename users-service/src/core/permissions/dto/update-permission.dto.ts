import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { permissionStatesName } from 'src/types/permissions.type';

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

  @IsOptional()
  @IsInt()
  @IsPositive()
  @MinLength(1)
  @IsIn(Object.values(permissionStatesName).map(Number))
  state_id: number;
}
