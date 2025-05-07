import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDocumentTypeDto {
  @IsString()
  @Length(5, 150)
  @Transform((data) => data.value.toLowerCase())
  document_type_name: string;

  @IsString()
  @Length(1, 7)
  @Transform((data) => data.value.toLowerCase())
  document_type_short_name: string;
}
