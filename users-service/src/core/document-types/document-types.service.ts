import { Injectable } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document_type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypes } from 'src/database';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
  valueExistValidate,
} from 'src/utils';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentTypes)
    private readonly documentTypesRepository: Repository<DocumentTypes>,
  ) {}

  /*
    * Crea un nuevo tipo de documento.
  
  > Verifica si ya existe un tipo de documento con el nombre proporcionado antes de crearlo.
  > Verifica si ya existe un tipo de documento con el nombre corto proporcionado antes de crearlo.
  > Retorna una respuesta de éxito con el nuevo tipo de documento o una respuesta de conflicto si el nombre o el nombre corto ya existen.
  > Maneja posibles errores durante el proceso de creación.
    */
  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    try {
      const { document_type_name, document_type_short_name } =
        createDocumentTypeDto;

      await valueExistValidate(
        this.documentTypesRepository,
        'document_type_name',
        document_type_name,
      );

      await valueExistValidate(
        this.documentTypesRepository,
        'document_type_short_name',
        document_type_short_name,
      );

      const newDocumentType = this.documentTypesRepository.create({
        document_type_name,
        document_type_short_name,
      });

      await this.documentTypesRepository.save(newDocumentType);

      return successResponse(
        newDocumentType,
        'Document type created successfully',
      );
    } catch (error) {
      return errorResponse(error, 'Error creating document type');
    }
  }

  /*
    * Obtiene todos los tipos de documentos de la base de datos con soporte para paginación opcional.

  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los tipos de documentos sin paginar.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados.
  > Retorna una respuesta de éxito. Si se pagina, incluye los datos de los tipos de documentos y el total de tipos de documentos. Si no se pagina, solo incluye el array de tipos de documentos.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findAll(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const documentTypes = await this.documentTypesRepository.find();

        return successResponse(
          documentTypes,
          'Document types retrieved successfully',
        );
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [documentTypes, total] =
          await this.documentTypesRepository.findAndCount({
            skip,
            take: limitNumber,
          });

        return successResponse(
          { data: documentTypes, total },
          'Paginated document types retrieved successfully',
        );
      }
    } catch (error) {
      return errorResponse(error, 'Error retrieving document types');
    }
  }

  /*
    * Obtiene un tipo de documento específico por su ID.
    
  > Retorna una respuesta de éxito con el tipo de documento encontrado o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findOne(id: number) {
    try {
      const documentType = await this.documentTypesRepository.findOneBy({
        id_document_type: id,
      });

      if (!documentType) {
        return notFoundResponse('id_document_type');
      }

      return successResponse(
        documentType,
        'Document type retrieved successfully',
      );
    } catch (error) {
      return errorResponse(error, `Error retrieving document type`);
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
  async update(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    try {
      const documentType = await this.documentTypesRepository.findOneBy({
        id_document_type: id,
      });

      if (!documentType) {
        return notFoundResponse('id_document_type');
      }

      const { document_type_name, document_type_short_name } =
        updateDocumentTypeDto;

      if (!document_type_name && !document_type_short_name) {
        emptyDataResponse([document_type_name, document_type_short_name]);
      }

      if (document_type_name) {
        const documentTypeNameExist =
          await this.documentTypesRepository.findOneBy({
            document_type_name,
          });

        if (
          documentTypeNameExist &&
          documentTypeNameExist.id_document_type !== id
        ) {
          return conflictResponse('document_type_name', 'already exists');
        }
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
          return conflictResponse('document_type_short_name', 'already exists');
        }
      }

      await this.documentTypesRepository.update(id, {
        document_type_name,
        document_type_short_name,
      });

      const updatedDocumentType = await this.documentTypesRepository.findOneBy({
        id_document_type: id,
      });

      return successResponse(
        updatedDocumentType,
        'Document type updated successfully',
      );
    } catch (error) {
      return errorResponse(error, `Error updating document type`);
    }
  }
}
