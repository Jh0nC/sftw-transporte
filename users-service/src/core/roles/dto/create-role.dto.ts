import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsString, Length, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsInt()
  @MinLength(1)
  admin_company_id: number;

  @IsString()
  @Length(3, 100)
  @Transform((data) => data.value.toLowerCase())
  role_name: string;

  @IsArray()
  permissions_id: readonly number[];
}
