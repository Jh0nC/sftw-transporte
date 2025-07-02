import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNumberString,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateAdminCompanyDto {
  @IsInt()
  @IsPositive()
  identification_type_id: number;

  @IsNumberString()
  @Length(5, 30)
  identification_number: string;

  @IsString()
  @Length(2, 150)
  @Transform((data) => data.value.toLowerCase())
  company_name: string;

  @IsString()
  @Length(5, 255)
  address: string;

  @IsString()
  @Length(8, 20)
  @Transform((data) => data.value.trim())
  phone_number: string;

  @IsEmail()
  @Length(5, 150)
  email: string;

  @IsString()
  @Length(10, 200)
  @Transform((data) => data.value.toLowerCase())
  legal_representative: string;

  @IsInt()
  @IsPositive()
  representative_document_type_id: number;

  @IsNumberString()
  @Length(5, 30)
  representative_document: string;
}
