import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsInt()
  @MinLength(1)
  admin_company_id: number;

  @IsString()
  @Length(3, 100)
  @Transform((data) => data.value.toLowerCase())
  role_name: string;

  @IsArray()
  @ArrayMinSize(1)
  permissions_id: number[];
}
