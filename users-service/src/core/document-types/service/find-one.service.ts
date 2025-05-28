import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypes } from 'src/database';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class FindOneDocumentTypeService {
  constructor(
    @InjectRepository(DocumentTypes)
    private readonly documentTypesRepository: Repository<DocumentTypes>,
  ) {}

  async exec(id: number) {
    try {
      const documentType = await this.documentTypesRepository.findOneBy({
        id_document_type: id,
      });

      if (!documentType) {
        notFoundResponse('id_document_type');
      }

      return documentType;
    } catch (error) {
      errorResponse(error, `Error retrieving document type`);
    }
  }

  /*
      * Obtiene un tipo de documento específico por su ID.
      
    > Retorna una respuesta de éxito con el tipo de documento encontrado o una respuesta de "no encontrado" si el ID no existe.
    > Maneja posibles errores durante el proceso de obtención.
      */
}
