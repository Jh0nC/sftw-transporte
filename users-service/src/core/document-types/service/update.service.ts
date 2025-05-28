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
        emptyDataResponse(String(Object.keys(updateDocumentTypeDto)));
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

  /*
    * Actualiza un tipo de documento existente.

  > Verifica si el tipo de documento con el ID proporcionado existe.
  > Verifica si se proporcionan algún atributo para la actualización.
  > Si se proporciona un nuevo nombre de tipo de documento, verifica si ya existe un tipo de documento con ese nombre (excluyendo el tipo de documento actual que se está actualizando).
  > Si se proporciona un nuevo nombre corto de tipo de documento, verifica si ya existe un tipo de documento con ese nombre corto (excluyendo el tipo de documento actual que se está actualizando).
  > Retorna una respuesta de éxito con el tipo de documento actualizado o una respuesta de "no encontrado" o "conflicto" según sea necesario.
  > Maneja posibles errores durante el proceso de actualización.
    */
}
