import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminCompanyDto } from './create-admin-company.dto';

export class UpdateAdminCompanyDto extends PartialType(CreateAdminCompanyDto) {}
