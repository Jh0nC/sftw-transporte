import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentTypeDto } from './create-document_type.dto';
import { IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDocumentTypeDto extends PartialType(CreateDocumentTypeDto) {
  @IsOptional()
  @IsString()
  @Length(5, 150)
  @Transform((data) => data.value.toLowerCase())
  document_type_name: string;

  @IsOptional()
  @IsString()
  @Length(1, 7)
  @Transform((data) => data.value.toLowerCase())
  document_type_short_name: string;
}
