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
} from '../../utils';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
  ) {}

  /*
    * Crea un nuevo permiso.

  > Verifica si ya existe un permiso con el nombre proporcionado antes de crearlo.
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

      const newPermission = this.permissionsRepository.create({
        permission_name,
        description,
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
        const permissions = await this.permissionsRepository.find();

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
    * Obtiene todos los roles que tienen asignado un permiso específico.

  > Busca el permiso por su ID, incluyendo la relación con la tabla de roles.
  > Retorna una respuesta de éxito con un array de roles que tienen el permiso asignado o una respuesta de "no encontrado" si el ID del permiso no existe.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findRolesWithPermission(id: number) {
    try {
      const rolesWithPermission = await this.permissionsRepository.findOne({
        where: { id_permission: id },
        relations: ['roles'],
      });

      if (!rolesWithPermission) {
        return notFoundResponse('id_permission');
      }

      return successResponse(
        rolesWithPermission.roles,
        `Roles with permission ID ${id} retrieved successfully`,
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving roles with permission ID ${id}`,
      );
    }
  }

  /*
    * Actualiza un permiso existente.

  > Verifica si el permiso con el ID proporcionado existe.
  > **Verifica si al menos uno de los campos (nombre o descripción) está definido en los datos de actualización para evitar una actualización innecesaria.**
  > Si se proporciona un nuevo nombre de permiso, verifica si ya existe un permiso con ese nombre (excluyendo el permiso actual que se está actualizando).
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

      const { permission_name, description } = updatePermissionDto; // ! Esta respuesta parece estar incompleta o no definida. Revisar la función 'emptyDataResponse'.

      if (!permission_name && !description) {
        emptyDataResponse([permission_name, description]);
      }

      if (permission_name) {
        const permissionNameExist = await this.permissionsRepository.findOneBy({
          permission_name,
        });

        if (permissionNameExist && permissionNameExist.id_permission !== id) {
          return conflictResponse('permission_name', 'already exists');
        }
      }

      await this.permissionsRepository.update(id, {
        permission_name,
        description,
      });

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

  > Verifica si el permiso con el ID proporcionado existe antes de eliminarlo.
  > Retorna una respuesta de éxito tras la eliminación exitosa o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de eliminación.
    */
  async remove(id: number) {
    try {
      const permission = await this.permissionsRepository.findOneBy({
        id_permission: id,
      });

      if (!permission) {
        return notFoundResponse('id_permission');
      }

      await this.permissionsRepository.delete(id);

      return successResponse(null, 'Permission deleted successfully');
    } catch (error) {
      return errorResponse(error, `Error deleting permission with id: ${id}`);
    }
  }
}
