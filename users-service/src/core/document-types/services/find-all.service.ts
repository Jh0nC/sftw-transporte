import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypes } from 'src/database';
import { errorResponse } from 'src/utils';

@Injectable()
export class FindAllDocumentTypesService {
  constructor(
    @InjectRepository(DocumentTypes)
    private readonly documentTypesRepository: Repository<DocumentTypes>,
  ) {}

  async exec(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const documentTypes = await this.documentTypesRepository.find();

        return documentTypes;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [documentTypes, total] =
          await this.documentTypesRepository.findAndCount({
            skip,
            take: limitNumber,
          });

        return { data: documentTypes, total };
      }
    } catch (error) {
      errorResponse(error, 'Error retrieving document types');
    }
  }
}
