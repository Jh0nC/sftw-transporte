import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyIdentificationType } from 'src/database';
import { Repository } from 'typeorm';
import { UpdateCompanyIdentificationTypeDto } from '../dto';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
} from 'src/utils';

@Injectable()
export class UpdateCompanyIdentificationTypeService {
  constructor(
    @InjectRepository(CompanyIdentificationType)
    private readonly companyIdentificationTypesRepository: Repository<CompanyIdentificationType>,
  ) {}

  async exec(
    id: number,
    updateCompanyIdentificationTypeDto: UpdateCompanyIdentificationTypeDto,
  ) {
    try {
      const currentCompanyIdentificationType =
        await this.companyIdentificationTypesRepository.findOneBy({
          id_identification_type: id,
        });

      if (!currentCompanyIdentificationType) {
        notFoundResponse('Company identification type');
      }

      const { identification_type_name, identification_type_short_name } =
        updateCompanyIdentificationTypeDto;

      if (!identification_type_name && identification_type_short_name) {
        emptyDataResponse(
          String(Object.keys(UpdateCompanyIdentificationTypeDto)),
        );
      }

      const toUpdateCompanyIdentificationType: Partial<CompanyIdentificationType> =
        {};

      if (identification_type_name) {
        const existingType =
          await this.companyIdentificationTypesRepository.findOneBy({
            identification_type_name,
          });

        if (existingType && existingType.id_identification_type !== id) {
          conflictResponse(
            'company_identification_type_name',
            'already exists',
          );
        }

        toUpdateCompanyIdentificationType.identification_type_name =
          identification_type_name;
      } else {
        toUpdateCompanyIdentificationType.identification_type_name =
          currentCompanyIdentificationType?.identification_type_name;
      }

      if (identification_type_short_name) {
        const existingType =
          await this.companyIdentificationTypesRepository.findOneBy({
            identification_type_short_name,
          });

        if (existingType && existingType.id_identification_type !== id) {
          conflictResponse('identification_type_short_name', 'already exists');
        }

        toUpdateCompanyIdentificationType.identification_type_short_name =
          identification_type_short_name;
      } else {
        toUpdateCompanyIdentificationType.identification_type_short_name =
          currentCompanyIdentificationType?.identification_type_short_name;
      }

      await this.companyIdentificationTypesRepository.update(
        id,
        toUpdateCompanyIdentificationType,
      );

      const updatedCompanyIdentificationType =
        await this.companyIdentificationTypesRepository.findOneBy({
          id_identification_type: id,
        });

      return updatedCompanyIdentificationType;
    } catch (error) {
      errorResponse(error, 'Error updating company identification type');
    }
  }
}
