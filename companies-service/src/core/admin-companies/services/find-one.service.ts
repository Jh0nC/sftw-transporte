import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminCompanies } from 'src/database';
import { Repository } from 'typeorm';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class FindOneAdminCompanyService {
  constructor(
    @InjectRepository(AdminCompanies)
    private readonly adminCompaniesRepository: Repository<AdminCompanies>,
  ) {}

  async exec(id: number) {
    try {
      const adminCompany = await this.adminCompaniesRepository.findOne({
        where: { id_admin_company: id },
        relations: [
          'identification_type',
          'representative_document_type',
          'state',
        ],
      });

      if (!adminCompany) {
        notFoundResponse(`id_admin_company: ${id}`);
      }

      return adminCompany;
    } catch (error) {
      errorResponse(error, 'error retrieving admin company');
    }
  }
}
