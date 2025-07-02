import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypes } from 'src/database';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
} from 'src/utils';
import { UpdateDocumentTypeDto } from '../dto/update-document_type.dto';

@Injectable()
export class UpdateDocumentTypeService {
  constructor(
    @InjectRepository(DocumentTypes)
    private readonly documentTypesRepository: Repository<DocumentTypes>,
  ) {}

  async exec(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    try {
      const currentDocumentType = await this.documentTypesRepository.findOneBy({
        id_document_type: id,
      });

      if (!currentDocumentType) {
        notFoundResponse('id_document_type');
      }

      const { document_type_name, document_type_short_name } =
        updateDocumentTypeDto;

      if (!document_type_name && !document_type_short_name) {
        emptyDataResponse(String(Object.keys(UpdateDocumentTypeDto)));
      }

      const toUpdateDocumentType: Partial<DocumentTypes> = {};

      if (document_type_name) {
        const documentTypeNameExist =
          await this.documentTypesRepository.findOneBy({ document_type_name });

        if (
          documentTypeNameExist &&
          documentTypeNameExist.id_document_type !== id
        ) {
          conflictResponse('document_type_name', 'already exists');
        }
      } else {
        toUpdateDocumentType.document_type_name =
          currentDocumentType?.document_type_name;
      }

      if (document_type_short_name) {
        const documentTypeShortNameExist =
          await this.documentTypesRepository.findOneBy({
            document_type_short_name,
          });

        if (
          documentTypeShortNameExist &&
          documentTypeShortNameExist.id_document_type !== id
        ) {
          conflictResponse('document_type_short_name', 'already exists');
        }
      } else {
        toUpdateDocumentType.document_type_short_name =
          currentDocumentType?.document_type_short_name;
      }

      await this.documentTypesRepository.update(id, toUpdateDocumentType);

      const updatedDocumentType = await this.documentTypesRepository.findOneBy({
        id_document_type: id,
      });

      return updatedDocumentType;
    } catch (error) {
      errorResponse(error, `Error updating document type`);
    }
  }
}
