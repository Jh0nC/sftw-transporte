import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { States } from '../entities';
import { UpdateStateDto } from '../dto/update-state.dto';
import { conflictResponse, errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class UpdateStateService {
  constructor(
    @InjectRepository(States)
    private readonly statesRepository: Repository<States>,
  ) {}

  async exec(id: number, updateStateDto: UpdateStateDto) {
    try {
      const state = await this.statesRepository.findOneBy({ id_state: id });
      if (!state) {
        return notFoundResponse('id_state');
      }

      if (updateStateDto.state_name) {
        const stateNameExist = await this.statesRepository.findOneBy({
          state_name: updateStateDto.state_name,
        });

        if (stateNameExist && stateNameExist.id_state !== id) {
          return conflictResponse('state_name', 'already exist');
        }
      }

      await this.statesRepository.update(id, updateStateDto);

      const updatedState = await this.statesRepository.findOneBy({
        id_state: id,
      });

      return updatedState;
    } catch (error) {
      return errorResponse(error, `Error updating state`);
    }
  }

  /*
   * Actualiza un estado existente.
  
  > Verifica si el estado con el ID proporcionado existe.
  > Si se proporciona un nuevo nombre de estado, verifica si ya existe un estado con ese nombre (excluyendo el estado actual que se está actualizando).
  > Retorna una respuesta de éxito con el estado actualizado o una respuesta de "no encontrado" o "conflicto" según sea necesario.
  > Maneja posibles errores durante el proceso de actualización.
   */
}
