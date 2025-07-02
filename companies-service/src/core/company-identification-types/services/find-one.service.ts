import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyIdentificationType } from 'src/database';
import { errorResponse, notFoundResponse } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneCompanyIdentificationTypesService {
  constructor(
    @InjectRepository(CompanyIdentificationType)
    private readonly companyIdentificationTypesRepository: Repository<CompanyIdentificationType>,
  ) {}

  async exec(id: number) {
    try {
      const companyIdentificationType =
        await this.companyIdentificationTypesRepository.findOneBy({
          id_identification_type: id,
        });

      if (!companyIdentificationType) {
        notFoundResponse(`id_identification_type ${id}`);
      }

      return companyIdentificationType;
    } catch (error) {
      errorResponse(error, `Error retrieving document type`);
    }
  }
}
