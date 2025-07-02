import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyIdentificationType } from 'src/database';
import { errorResponse } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllCompanyIdentificationTypesService {
  constructor(
    @InjectRepository(CompanyIdentificationType)
    private readonly companyIdentificationTypesRepository: Repository<CompanyIdentificationType>,
  ) {}

  async exec(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const companyIdentificationType =
          await this.companyIdentificationTypesRepository.find();

        return companyIdentificationType;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [companyIdentificationType, total] =
          await this.companyIdentificationTypesRepository.findAndCount({
            skip,
            take: limitNumber,
          });

        return { data: companyIdentificationType, total };
      }
    } catch (error) {
      errorResponse(error, 'Error retrieving document types');
    }
  }
}
