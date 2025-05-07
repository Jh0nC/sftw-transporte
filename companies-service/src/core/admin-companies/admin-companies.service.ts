import { Injectable } from '@nestjs/common';
import { CreateAdminCompanyDto } from './dto/create-admin-company.dto';
import { UpdateAdminCompanyDto } from './dto/update-admin-company.dto';

@Injectable()
export class AdminCompaniesService {
  create(createAdminCompanyDto: CreateAdminCompanyDto) {
    return 'This action adds a new adminCompany';
  }

  findAll() {
    return `This action returns all adminCompanies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminCompany`;
  }

  update(id: number, updateAdminCompanyDto: UpdateAdminCompanyDto) {
    return `This action updates a #${id} adminCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminCompany`;
  }
}
