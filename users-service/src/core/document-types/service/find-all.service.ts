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

  /*
    * Obtiene todos los tipos de documentos de la base de datos con soporte para paginación opcional.

  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los tipos de documentos sin paginar.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados.
  > Retorna una respuesta de éxito. Si se pagina, incluye los datos de los tipos de documentos y el total de tipos de documentos. Si no se pagina, solo incluye el array de tipos de documentos.
  > Maneja posibles errores durante el proceso de obtención.
    */
}
