import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypes } from 'src/database';
import { errorResponse, existsValueValidate } from 'src/utils';
import { CreateDocumentTypeDto } from '../dto/create-document_type.dto';

@Injectable()
export class CreateDocumentTypeService {
  constructor(
    @InjectRepository(DocumentTypes)
    private readonly documentTypesRepository: Repository<DocumentTypes>,
  ) {}

  async exec(createDocumentTypeDto: CreateDocumentTypeDto) {
    try {
      const { document_type_name, document_type_short_name } =
        createDocumentTypeDto;

      existsValueValidate(
        this.documentTypesRepository,
        'document_type_name',
        document_type_name,
      );

      existsValueValidate(
        this.documentTypesRepository,
        'document_type_short_name',
        document_type_short_name,
      );

      const newDocumentType = this.documentTypesRepository.create({
        document_type_name,
        document_type_short_name,
      });

      await this.documentTypesRepository.save(newDocumentType);

      return newDocumentType;
    } catch (error) {
      errorResponse(error, 'Error creating document type');
    }
  }

  /*
    * Crea un nuevo tipo de documento.
  
  > Verifica si ya existe un tipo de documento con el nombre proporcionado antes de crearlo.
  > Verifica si ya existe un tipo de documento con el nombre corto proporcionado antes de crearlo.
  > Retorna una respuesta de éxito con el nuevo tipo de documento o una respuesta de conflicto si el nombre o el nombre corto ya existen.
  > Maneja posibles errores durante el proceso de creación.
    */
}
