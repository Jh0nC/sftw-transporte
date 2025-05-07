import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { States } from './entities';
import {
  conflictResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../utils';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(States)
    private readonly statesRespository: Repository<States>,
  ) {}

  /*
   * Crea un nuevo estado.
  
  > Verifica si ya existe un estado con el nombre proporcionado antes de crearlo.
  > Retorna una respuesta de éxito con el nuevo estado o una respuesta de conflicto si el nombre ya existe.
  > Maneja posibles errores durante el proceso de creación.
   */
  async create(createStateDto: CreateStateDto) {
    try {
      const { state_name } = createStateDto;

      const stateNameExist = await this.statesRespository.findOneBy({
        state_name,
      });

      if (stateNameExist) {
        return conflictResponse('state_name', 'already exist');
      }

      const newState = this.statesRespository.create({
        state_name,
      });

      await this.statesRespository.save(newState);

      return successResponse(newState, 'State created successfully');
    } catch (error) {
      return errorResponse(error, 'Error creating state');
    }
  }

  /*
   * Obtiene todos los estados de la base de datos.

  > Retorna una respuesta de éxito con un array de estados.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findAll() {
    try {
      const states = await this.statesRespository.find();

      return successResponse(states, 'States retrieved successfully');
    } catch (error) {
      return errorResponse(error, 'Error retrieving states');
    }
  }

  /*
   * Obtiene un estado específico por su ID.

  > Retorna una respuesta de éxito con el estado encontrado o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findOne(id: number) {
    try {
      const state = await this.statesRespository.findOneBy({ id_state: id });

      if (!state) {
        return notFoundResponse('id_state');
      }
      return successResponse(state, 'State retrieved successfully');
    } catch (error) {
      return errorResponse(error, `Error retrieving state`);
    }
  }

  /*
   * Actualiza un estado existente.
  
  > Verifica si el estado con el ID proporcionado existe.
  > Si se proporciona un nuevo nombre de estado, verifica si ya existe un estado con ese nombre (excluyendo el estado actual que se está actualizando).
  > Retorna una respuesta de éxito con el estado actualizado o una respuesta de "no encontrado" o "conflicto" según sea necesario.
  > Maneja posibles errores durante el proceso de actualización.
   */
  async update(id: number, updateStateDto: UpdateStateDto) {
    try {
      const state = await this.statesRespository.findOneBy({ id_state: id });
      if (!state) {
        return notFoundResponse('id_state');
      }

      if (updateStateDto.state_name) {
        const stateNameExist = await this.statesRespository.findOneBy({
          state_name: updateStateDto.state_name,
        });

        if (stateNameExist && stateNameExist.id_state !== id) {
          return conflictResponse('state_name', 'already exist');
        }
      }

      await this.statesRespository.update(id, updateStateDto);

      const updatedState = await this.statesRespository.findOneBy({
        id_state: id,
      });

      return successResponse(updatedState, 'State updated successfully');
    } catch (error) {
      return errorResponse(error, `Error updating state`);
    }
  } 
  
  /*
   * Elimina un estado por su ID.
  
  > Verifica si el estado con el ID proporcionado existe antes de eliminarlo.
  > Retorna una respuesta de éxito tras la eliminación exitosa o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de eliminación.
   */

  async remove(id: number) {
    try {
      const state = await this.statesRespository.findOneBy({ id_state: id });

      if (!state) {
        return notFoundResponse('id_state');
      }

      await this.statesRespository.delete(id);

      return successResponse(null, 'State deleted successfully');
    } catch (error) {
      return errorResponse(error, `Error deleting state`);
    }
  }
}
