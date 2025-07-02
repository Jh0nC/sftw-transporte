import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminCompanies } from 'src/database';
import { notFoundResponse, conflictResponse } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteAdminCompanyService {
  constructor(
    @InjectRepository(AdminCompanies)
    private readonly adminCompaniesRepository: Repository<AdminCompanies>,
  ) {}

  async exec(id: number) {
    try {
      const adminCompany = await this.adminCompaniesRepository.findOne({
        where: { id_admin_company: id },
        relations: ['user_admin_company', 'roles', 'vehicles', 'travel_orders'],
      });

      if (!adminCompany) {
        notFoundResponse(`Admin company with id: ${id}`);
      }

      if (
        adminCompany?.user_admin_company &&
        adminCompany.user_admin_company.length > 0
      ) {
        conflictResponse(
          'admin company',
          `is associated with many records and cannot be deleted directly. 
          Remove from the records first.`,
        );
      }

      await this.adminCompaniesRepository.delete(id);
      return { message: 'Admin company deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting admin company: ${error.message}`);
    }
  }
}
