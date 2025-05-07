import { Injectable } from '@nestjs/common';
import { CreateCompanyIdentificationTypeDto } from './dto/create-company-identification-type.dto';
import { UpdateCompanyIdentificationTypeDto } from './dto/update-company-identification-type.dto';

@Injectable()
export class CompanyIdentificationTypesService {
  create(createCompanyIdentificationTypeDto: CreateCompanyIdentificationTypeDto) {
    return 'This action adds a new companyIdentificationType';
  }

  findAll() {
    return `This action returns all companyIdentificationTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyIdentificationType`;
  }

  update(id: number, updateCompanyIdentificationTypeDto: UpdateCompanyIdentificationTypeDto) {
    return `This action updates a #${id} companyIdentificationType`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyIdentificationType`;
  }
}
