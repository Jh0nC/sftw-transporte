import { Injectable } from '@nestjs/common';
import { UpdateCompanyIdentificationTypeDto } from './dto/update-company-identification-type.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  AdminCompanies,
  ClientCompanies,
  CompanyIdentificationType,
} from 'src/database';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
} from 'src/utils';

@Injectable()
export class CompanyIdentificationTypesService {
  constructor(
    @InjectRepository(CompanyIdentificationType)
    private readonly companyIdentificationTypeRepository: Repository<CompanyIdentificationType>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  async findAll(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const companyIdentificationTypes =
          await this.companyIdentificationTypeRepository.find();

        return successResponse(
          companyIdentificationTypes,
          'Company identification types retrieved successfully',
        );
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [companyIdentificationTypes, total] =
          await this.companyIdentificationTypeRepository.findAndCount({
            skip,
            take: limitNumber,
          });

        return successResponse(
          { data: companyIdentificationTypes, total },
          'Paginated company identification types retrieved successfully',
        );
      }
    } catch (error) {
      return errorResponse(
        error,
        'Error retrieving company identification types',
      );
    }
  }

  async findAllAdminNamesWithIdentificationType(id: number) {
    try {
      const identificationTypeExist =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!identificationTypeExist) {
        return notFoundResponse('id_identification_type');
      }

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

      return successResponse(
        adminCompanies,
        `Admin companies with identification type ID ${id} retrieved successfully (Query Builder)`,
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving admin companies with identification type ID ${id} (Query Builder)`,
      );
    }
  }
  
  async findAllClientsNamesWithIdentificationType(id: number) {
    try {
      const identificationTypeExist =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!identificationTypeExist) {
        return notFoundResponse('id_identification_type');
      }

      const clientCompanies = await this.entityManager
        .createQueryBuilder(ClientCompanies, 'client_company')
        .innerJoin(
          'client_company.identification_type',
          'identification_type',
          'identification_type.id_identification_type = :id',
          { id },
        )
        .select([
          'client_company.id_client_company',
          'client_company.client_company_name',
        ])
        .getMany();

      return successResponse(
        clientCompanies,
        `Client companies with identification type ID ${id} retrieved successfully (Query Builder)`,
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving client companies with identification type ID ${id} (Query Builder)`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const companyIdentificationType =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!companyIdentificationType) {
        return notFoundResponse('id_identification_type');
      }

      return successResponse(
        companyIdentificationType,
        'Company identification type retrieved successfully',
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving company identification type`,
      );
    }
  }
  async update(
    id: number,
    updateCompanyIdentificationTypeDto: UpdateCompanyIdentificationTypeDto,
  ) {
    try {
      const companyIdentificationType =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!companyIdentificationType) {
        return notFoundResponse('id_identification_type');
      }

      const { identification_type_name, identification_type_short_name } =
        updateCompanyIdentificationTypeDto;

      if (!identification_type_name && !identification_type_short_name) {
        emptyDataResponse([
          identification_type_name,
          identification_type_short_name,
        ]);
      }

      if (identification_type_name) {
        const identificationTypeNameExist =
          await this.companyIdentificationTypeRepository.findOneBy({
            identification_type_name,
          });

        if (
          identificationTypeNameExist &&
          identificationTypeNameExist.id_identification_type !== id
        ) {
          return conflictResponse('identification_type_name', 'already exists');
        }
      }

      if (identification_type_short_name) {
        const identificationTypeShortNameExist =
          await this.companyIdentificationTypeRepository.findOneBy({
            identification_type_short_name,
          });

        if (
          identificationTypeShortNameExist &&
          identificationTypeShortNameExist.id_identification_type !== id
        ) {
          return conflictResponse(
            'identification_type_short_name',
            'already exists',
          );
        }
      }

      await this.companyIdentificationTypeRepository.update(id, {
        identification_type_name,
        identification_type_short_name,
      });

      const updatedCompanyIdentificationType =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      return successResponse(
        updatedCompanyIdentificationType,
        'Company identification type updated successfully',
      );
    } catch (error) {
      return errorResponse(error, `Error updating company identification type`);
    }
  }
}
