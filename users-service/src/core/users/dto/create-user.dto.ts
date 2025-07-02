export class CreateUserDto {
  document_type_id: number;

  document_number: number;

  user_first_name: string;

  user_last_name: string;

  phone_number: string;

  address: string;

  email: string;

  password: string;

  roles: number | number[];

  birth_date: Date;

  gender: string;

  profile_photo: string;

  document_photo: string;
}
