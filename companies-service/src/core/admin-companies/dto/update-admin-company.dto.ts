import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminCompanyDto } from './create-admin-company.dto';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsJSON,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateAdminCompanyDto extends PartialType(CreateAdminCompanyDto) {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @MinLength(1)
  state_id: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @MinLength(1)
  identification_type_id: number;

  @IsOptional()
  @IsNumberString()
  @Length(5, 30)
  identification_number: string;

  @IsOptional()
  @IsString()
  @Length(2, 150)
  @Transform((data) => data.value.toLowerCase())
  company_name: string;

  @IsOptional()
  @IsString()
  @Length(5, 255)
  address: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  @Transform((data) => data.value.trim())
  phone_number: string;

  @IsOptional()
  @IsEmail()
  @Length(5, 150)
  email: string;

  @IsOptional()
  @IsString()
  @Length(10, 200)
  @Transform((data) => data.value.toLowerCase())
  legal_representative: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @MinLength(1)
  representative_document_type_id: number;

  @IsOptional()
  @IsNumberString()
  @Length(5, 30)
  representative_document: string;

  @IsOptional()
  @IsJSON()
  json_string_config: any;
}
