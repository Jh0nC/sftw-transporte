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
    private readonly statesRepository: Repository<States>,
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

      const stateNameExist = await this.statesRepository.findOneBy({
        state_name,
      });

      if (stateNameExist) {
        return conflictResponse('state_name', 'already exist');
      }

      const newState = this.statesRepository.create({
        state_name,
      });

      await this.statesRepository.save(newState);

      return successResponse(newState, 'State created successfully');
    } catch (error) {
      return errorResponse(error, 'Error creating state');
    }
  }

  /*
    * Obtiene todos los estados de la base de datos con soporte para paginación opcional.
    
  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los estados sin paginar.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados.
  > Retorna una respuesta de éxito. Si se pagina, incluye los datos de los estados y el total de estados. Si no se pagina, solo incluye el array de estados.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findAll(
    pageIndex?: number | undefined,
    limitNumber?: number | undefined,
  ) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const states = await this.statesRepository.find();

        return successResponse(states, 'All states retrieved successfully');
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [states, total] = await this.statesRepository.findAndCount({
          skip,
          take: limitNumber,
        });

        return successResponse(
          { data: states, total },
          'Paginated states retrieved successfully',
        );
      }
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
      const state = await this.statesRepository.findOneBy({ id_state: id });

      if (!state) {
        return notFoundResponse('id_state');
      }
      return successResponse(state, 'State retrieved successfully');
    } catch (error) {
      return errorResponse(error, `Error retrieving state`);
    }
  }

  /*
   * Obtiene un estado específico por su nombre.

  > Retorna una respuesta de éxito con el estado encontrado o una respuesta de "no encontrado" si el nombre no existe.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findOneByName(name: string) {
    try {
      const state = await this.statesRepository.findOneBy({
        state_name: name,
      });

      if (!state) {
        return notFoundResponse('state_name');
      }
      return successResponse(state, 'State retrieved successfully');
    } catch (error) {
      return errorResponse(error, `Error retrieving state by name`);
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
      const state = await this.statesRepository.findOneBy({ id_state: id });

      if (!state) {
        return notFoundResponse('id_state');
      }

      await this.statesRepository.delete(id);

      return successResponse(null, 'State deleted successfully');
    } catch (error) {
      return errorResponse(error, `Error deleting state`);
    }
  }
}
