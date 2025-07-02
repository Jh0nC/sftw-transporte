import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { rolesStatesName } from 'src/types';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsIn(Object.values(rolesStatesName).map(Number))
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
