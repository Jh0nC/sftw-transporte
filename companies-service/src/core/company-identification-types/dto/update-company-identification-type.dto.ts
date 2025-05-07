import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyIdentificationTypeDto } from './create-company-identification-type.dto';
import { IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCompanyIdentificationTypeDto extends PartialType(
  CreateCompanyIdentificationTypeDto,
) {
  @IsOptional()
  @IsString()
  @Length(10, 150)
  @Transform((data) => data.value.toLowerCase())
  identification_type_name: string;

  @IsOptional()
  @IsString()
  @Length(2, 7)
  @Transform((data) => data.value.toLowerCase())
  identification_type_short_name: string;
}
