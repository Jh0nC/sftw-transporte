import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsJSON,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { adminCompanyStates } from 'src/types';

export class UpdateAdminCompanyDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsIn(Object.values(adminCompanyStates).map(Number))
  state_id: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
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
  representative_document_type_id: number;

  @IsOptional()
  @IsNumberString()
  @Length(5, 30)
  representative_document: string;

  @IsOptional()
  @IsJSON()
  json_string_config: JSON | string;
}
