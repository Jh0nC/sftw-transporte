import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsString()
  @Length(3, 100)
  @Transform((data) => data.value.toLowerCase())
  role_name: string;

  @IsArray()
  @ArrayMinSize(1)
  permissions_id: number[];
}
