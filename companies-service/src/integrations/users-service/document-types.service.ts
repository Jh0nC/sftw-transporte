import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { envVariables } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { DocumentTypes } from 'src/database';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class UsersService {
  private readonly usersServiceUrl: string;

  /*
    * Inicializa la URL del servicio de estados.

  > Lee la URL desde las variables de entorno.
  > Se salta la validación de la variable de entorno definida ya que en el procesado ya se toma en cuenta y no se inicia si no esta
    */
  constructor(private readonly httpService: HttpService) {
    this.usersServiceUrl = envVariables.usersServiceUrl;
  }

  /*
    * Obtiene un estado específico por su ID desde un servicio externo.

  > Realiza una petición GET al servicio de usuarios/document-types externo utilizando el ID proporcionado.
  > Si la respuesta del servicio externo no contiene datos, lanza una excepción HttpException con un estado NOT_FOUND.
  > Retorna los datos del document_type obtenidos del servicio externo.
  > Maneja errores durante la petición.
    */
  async findDocumentTypeById(
    id: number,
  ): Promise<DocumentTypes | DocumentTypes[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.usersServiceUrl}/document-types/${id}`),
      );

      if (!response?.data) {
        throw new HttpException(
          notFoundResponse('id_document_type'),
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      Logger.error(
        'Error obtaining document_type',
        error.response?.data || error.message,
      );

      throw new HttpException(
        errorResponse(error, 'Error retrieving document type'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
