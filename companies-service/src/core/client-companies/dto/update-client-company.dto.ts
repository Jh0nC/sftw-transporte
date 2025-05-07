import { PartialType } from '@nestjs/mapped-types';
import { CreateClientCompanyDto } from './create-client-company.dto';

export class UpdateClientCompanyDto extends PartialType(CreateClientCompanyDto) {}
