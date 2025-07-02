import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminCompanies } from 'src/database';
import { Repository } from 'typeorm';
import { errorResponse } from 'src/utils';

@Injectable()
export class FindAllAdminCompaniesService {
  constructor(
    @InjectRepository(AdminCompanies)
    private readonly adminCompaniesRepository: Repository<AdminCompanies>,
  ) {}

  async exec(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const adminCompany = await this.adminCompaniesRepository.find({
          relations: [
            'identification_type',
            'representative_document_type',
            'state',
          ],
        });

        return adminCompany;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [adminCompanies, total] =
          await this.adminCompaniesRepository.findAndCount({
            relations: [
              'identification_type',
              'representative_document_type',
              'state',
            ],
            skip,
            take: limitNumber,
          });

        return { data: adminCompanies, total };
      }
    } catch (error) {
      errorResponse(error, 'error retrieving admin companies');
    }
  }
}
