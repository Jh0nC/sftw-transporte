import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from 'src/database';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
  valueExistValidate,
} from 'src/utils';
import { StatesService } from 'src/integrations';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,

    private readonly statesServiceService: StatesService,
  ) {}

  /*
  * Crea un nuevo permiso.

    > Verifica si ya existe un permiso con el nombre proporcionado antes de crearlo.
    > Obtiene el estado activo por defecto para el permiso.
    > Crea un nuevo permiso con el nombre, descripción y estado activo por defecto.
    > Guarda el nuevo permiso en la base de datos.
    > Retorna una respuesta de éxito con el nuevo permiso o una respuesta de conflicto si el nombre ya existe.
    > Maneja posibles errores durante el proceso de creación.
      */
  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const { permission_name, description } = createPermissionDto;

      const permissionNameExist = await this.permissionsRepository.findOneBy({
        permission_name,
      });

      if (permissionNameExist) {
        return conflictResponse('permission_name', 'already exists');
      }

      /* Valor activo por defecto */
      const defaultState = await this.statesServiceService.findOne(
        /*  
        * Estados disponibles para permissions
          > per_active        :id=9
          > per_inactive      :id=10
          */
        9,
      );

      const newPermission = this.permissionsRepository.create({
        permission_name,
        description,
        state: defaultState,
      });

      await this.permissionsRepository.save(newPermission);

      return successResponse(newPermission, 'Permission created successfully');
    } catch (error) {
      return errorResponse(error, 'Error creating permission');
    }
  }

  /*
    * Obtiene todos los permisos de la base de datos con soporte para paginación opcional.

  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los permisos sin paginar.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados.
  > Retorna una respuesta de éxito. Si se pagina, incluye los datos de los permisos y el total de permisos. Si no se pagina, solo incluye el array de permisos.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findAll(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const permissions = await this.permissionsRepository.find({
          relations: ['roles'],
        });

        return successResponse(
          permissions,
          'Permissions retrieved successfully',
        );
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [permissions, total] =
          await this.permissionsRepository.findAndCount({
            skip,
            take: limitNumber,
          });

        return successResponse(
          { data: permissions, total },
          'Paginated permissions retrieved successfully',
        );
      }
    } catch (error) {
      return errorResponse(error, 'Error retrieving permissions');
    }
  }

  /*
    * Obtiene un permiso específico por su ID.

  > Retorna una respuesta de éxito con el permiso encontrado o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findOne(id: number) {
    try {
      const permission = await this.permissionsRepository.findOneBy({
        id_permission: id,
      });

      if (!permission) {
        return notFoundResponse('id_permission');
      }

      return successResponse(permission, 'Permission retrieved successfully');
    } catch (error) {
      return errorResponse(error, `Error retrieving permission with id: ${id}`);
    }
  }

  /*
  * Obtiene todos los roles que tienen asignado un permiso específico con soporte para paginación opcional.

    > Busca el permiso por su ID, incluyendo la relación con la tabla de roles.
    > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los roles asociados al permiso.
    > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los roles asociados al permiso.
    > Retorna una respuesta de éxito con un array de roles (paginados o no) que tienen el permiso asignado o una respuesta de "no encontrado" si el ID del permiso no existe. Si se pagina, incluye los datos de los roles y el total de roles.
    > Maneja posibles errores durante el proceso de obtención.
    */
  async findRolesWithPermission(
    id: number,
    pageIndex?: number,
    limitNumber?: number,
  ) {
    try {
      const permission = await this.permissionsRepository.findOne({
        where: { id_permission: id },
        relations: ['roles'],
      });

      if (!permission) {
        return notFoundResponse('id_permission');
      }

      const roles = permission.roles;

      if (pageIndex === undefined || limitNumber === undefined) {
        return successResponse(
          roles,
          `Roles with permission ID: ${id} retrieved successfully`,
        );
      } else {
        const skip = (pageIndex - 1) * limitNumber;
        const paginatedRoles = roles.slice(skip, skip + limitNumber);
        const total = roles.length;

        return successResponse(
          { data: paginatedRoles, total },
          `Paginated roles with permission ID: ${id} retrieved successfully`,
        );
      }
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving roles with permission ID: ${id}`,
      );
    }
  }

  /*
  * Actualiza un permiso existente.

    > Verifica si el permiso con el ID proporcionado existe.
    > **Verifica si al menos uno de los campos (nombre, descripción o state_id) está definido en los datos de actualización para evitar una actualización innecesaria.**
    > Si se proporciona un nuevo nombre de permiso, verifica si ya existe un permiso con ese nombre (excluyendo el permiso actual que se está actualizando).
    > Si se proporciona un `state_id`, busca y asigna el estado correspondiente.
    > Actualiza el nombre, la descripción y/o el estado del permiso si se proporcionan en el DTO.
    > Retorna una respuesta de éxito con el permiso actualizado o una respuesta de "no encontrado" o "conflicto" según sea necesario.
    > Maneja posibles errores durante el proceso de actualización.
    */
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.permissionsRepository.findOneBy({
        id_permission: id,
      });

      if (!permission) {
        return notFoundResponse('id_permission');
      }

      const { permission_name, description, state_id } = updatePermissionDto;

      if (!permission_name && !description && state_id === undefined) {
        emptyDataResponse([permission_name, description, state_id]);
      }

      const updateData: Partial<Permissions> = {};

      if (permission_name) {
        await valueExistValidate(
          this.permissionsRepository,
          'permission_name',
          permission_name,
        );

        updateData.permission_name = permission_name;
      }

      if (description) {
        updateData.description = description;
      }

      if (state_id !== undefined) {
        const newState = await this.statesServiceService.findOne(state_id);

        if (newState) {
          updateData.state = newState;
        } else {
          return notFoundResponse('state_id');
        }
      }

      await this.permissionsRepository.update(id, updateData);

      const updatedPermission = await this.permissionsRepository.findOneBy({
        id_permission: id,
      });

      return successResponse(
        updatedPermission,
        'Permission updated successfully',
      );
    } catch (error) {
      return errorResponse(error, `Error updating permission with id: ${id}`);
    }
  }

  /*
  * Elimina un permiso por su ID.

    > Verifica si el permiso con el ID proporcionado existe.
    > **Valida si el permiso está asociado a algún rol. Si lo está, no se puede eliminar y se retorna una respuesta de conflicto.**
    > Si el permiso no está asociado a ningún rol, se elimina de la base de datos.
    > Retorna una respuesta de éxito tras la eliminación o una respuesta de "no encontrado" o "conflicto" según sea necesario.
    > Maneja posibles errores durante el proceso de eliminación.
    */
  async remove(id: number) {
    try {
      const permission = await this.permissionsRepository.findOne({
        where: { id_permission: id },
        relations: ['roles'],
      });

      if (!permission) {
        return notFoundResponse('id_permission');
      }

      if (permission.roles && permission.roles.length > 0) {
        return conflictResponse(
          'permission',
          'is associated with one or more roles and cannot be deleted',
        );
      }

      await this.permissionsRepository.delete(id);

      return successResponse(null, 'Permission deleted successfully');
    } catch (error) {
      return errorResponse(error, `Error deleting permission with id: ${id}`);
    }
  }
}
