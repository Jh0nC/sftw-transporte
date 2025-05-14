import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { envVariables } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { States } from 'src/database';

@Injectable()
export class StatesService {
  private readonly statesServiceUrl: string;

  /*
    * Inicializa la URL del servicio de estados.

  > Lee la URL desde las variables de entorno.
  > Se salta la validación de la variable de entorno definida ya que en el procesado ya se toma en cuenta y no se inicia si no esta
    */
  constructor(private readonly httpService: HttpService) {
    this.statesServiceUrl = envVariables.statesServiceUrl;
  }

  /*
    * Obtiene un estado específico por su ID desde un servicio externo.

  > Realiza una petición GET al servicio de estados externo utilizando el ID proporcionado.
  > Si la respuesta del servicio externo no contiene datos, lanza una excepción HttpException con un estado NOT_FOUND.
  > Retorna los datos del estado obtenidos del servicio externo.
  > Maneja errores durante la petición, relanzando las excepciones HttpException o lanzando una nueva excepción INTERNAL_SERVER_ERROR en caso de otros errores.
    */
  async findOne(id: number): Promise<States> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.statesServiceUrl}/states/${id}`),
      );

      if (!response?.data) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Request data, id_state: ${id}, was not found`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data as States;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      Logger.error(
        'Error obtaining state',
        error.response?.data || error.message,
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error retrieving state`,
          error: error.message || String(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
