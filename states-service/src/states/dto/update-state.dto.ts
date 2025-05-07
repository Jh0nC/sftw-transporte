import { PartialType } from '@nestjs/mapped-types';
import { CreateStateDto } from './create-state.dto';
import { IsString, Length } from 'class-validator';

export class UpdateStateDto extends PartialType(CreateStateDto) {
  @IsString()
  @Length(2, 30)
  state_name: string;
}
