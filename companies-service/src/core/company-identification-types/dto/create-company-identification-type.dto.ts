import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateCompanyIdentificationTypeDto {
  @IsString()
  @Length(10, 150)
  @Transform((data) => data.value.toLowerCase())
  identification_type_name: string;

  @IsString()
  @Length(2, 7)
  @Transform((data) => data.value.toLowerCase())
  identification_type_short_name: string;
}
