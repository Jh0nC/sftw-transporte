import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { States } from '../entities';
import { errorResponse } from 'src/utils';

@Injectable()
export class FindAllStatesService {
  constructor(
    @InjectRepository(States)
    private readonly statesRepository: Repository<States>,
  ) {}

  async exec(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const states = await this.statesRepository.find();

        return states;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [states, total] = await this.statesRepository.findAndCount({
          skip,
          take: limitNumber,
        });

        return { data: states, total };
      }
    } catch (error) {
      return errorResponse(error, 'Error retrieving states');
    }
  }

  /*
    * Obtiene todos los estados de la base de datos con soporte para paginación opcional.
    
  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los estados sin paginar.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados.
  > Retorna una respuesta de éxito. Si se pagina, incluye los datos de los estados y el total de estados. Si no se pagina, solo incluye el array de estados.
  > Maneja posibles errores durante el proceso de obtención.
    */
}
