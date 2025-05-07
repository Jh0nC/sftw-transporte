import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyIdentificationTypeDto } from './create-company-identification-type.dto';

export class UpdateCompanyIdentificationTypeDto extends PartialType(CreateCompanyIdentificationTypeDto) {}
