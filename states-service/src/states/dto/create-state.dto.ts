import { IsString, Length } from 'class-validator'
export class CreateStateDto {
  @IsString()
  @Length(2, 30)
  state_name: string;
}
