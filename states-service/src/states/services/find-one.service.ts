import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { States } from '../entities';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class FindOneStateService {
  constructor(
    @InjectRepository(States)
    private readonly statesRepository: Repository<States>,
  ) {}

  async exec(id: number) {
    try {
      const state = await this.statesRepository.findOneBy({ id_state: id });

      if (!state) {
        notFoundResponse('id_state');
      }
      return state;
    } catch (error) {
      errorResponse(error, `Error retrieving state`);
    }
  }

  /*
   * Obtiene un estado específico por su ID.

  > Retorna una respuesta de éxito con el estado encontrado o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de obtención.
   */
}
