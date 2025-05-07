import { Injectable } from '@nestjs/common';
import { CreateClientCompanyDto } from './dto/create-client-company.dto';
import { UpdateClientCompanyDto } from './dto/update-client-company.dto';

@Injectable()
export class ClientCompaniesService {
  create(createClientCompanyDto: CreateClientCompanyDto) {
    return 'This action adds a new clientCompany';
  }

  findAll() {
    return `This action returns all clientCompanies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientCompany`;
  }

  update(id: number, updateClientCompanyDto: UpdateClientCompanyDto) {
    return `This action updates a #${id} clientCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientCompany`;
  }
}
