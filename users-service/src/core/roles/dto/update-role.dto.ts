import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsInt()
  @MinLength(1)
  state_id: number;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Transform((data) => data.value.toLowerCase())
  role_name: string;

  @IsOptional()
  @IsArray()
  permissions_id: number[];
}
