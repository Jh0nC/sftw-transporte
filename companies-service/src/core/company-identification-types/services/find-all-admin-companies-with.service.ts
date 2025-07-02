import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AdminCompanies, CompanyIdentificationType } from 'src/database';
import { EntityManager, Repository } from 'typeorm';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class FindAllAdminCompaniesWithIdentificationTypeService {
  constructor(
    @InjectRepository(CompanyIdentificationType)
    private readonly companyIdentificationTypesRepository: Repository<CompanyIdentificationType>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async exec(id: number, pageIndex?: number, limitNumber?: number) {
    try {
      const identificationTypeExist =
        await this.companyIdentificationTypesRepository.findOneBy({
          id_identification_type: id,
        });

      if (!identificationTypeExist) {
        return notFoundResponse('id_identification_type');
      }

      if (pageIndex === undefined || limitNumber === undefined) {
        const adminCompanies = await this.entityManager
          .createQueryBuilder(AdminCompanies, 'admin_company')
          .innerJoin(
            'admin_company.identification_type',
            'identification_type',
            'identification_type.id_identification_type = :id',
            { id },
          )
          .select([
            'admin_company.id_admin_company',
            'admin_company.company_name',
          ])
          .getMany();

        return adminCompanies;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [adminCompanies, total] = await this.entityManager
          .createQueryBuilder(AdminCompanies, 'admin_company')
          .innerJoin(
            'admin_company.identification_type',
            'identification_type',
            'identification_type.id_identification_type = :id',
            { id },
          )
          .select([
            'admin_company.id_admin_company',
            'admin_company.company_name',
          ])
          .skip(skip)
          .take(limitNumber)
          .getManyAndCount();

        return { data: adminCompanies, total };
      }
    } catch (error) {
      errorResponse(
        error,
        `Error retrieving admin companies with identification type ID ${id} (Query Builder)`,
      );
    }
  }
}
