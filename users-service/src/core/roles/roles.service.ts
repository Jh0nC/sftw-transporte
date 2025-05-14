import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  valueExistValidate,
  conflictResponse,
  emptyDataResponse,
} from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions, Roles } from 'src/database';
import { PermissionsService } from 'src/core/index.service';
import { AdminCompaniesService, StatesService } from 'src/integrations';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,

    private readonly companiesService: AdminCompaniesService,

    private readonly permissionsService: PermissionsService,

    private readonly statesService: StatesService,
  ) {}

  /*
    * Crea un nuevo rol.

  > Verifica si la compañía administradora con el ID proporcionado existe.
  > Valida si ya existe un rol con el mismo nombre en la base de datos.
  > Itera a través de los IDs de permisos proporcionados y verifica si cada permiso existe.
  > Obtiene el estado activo por defecto para el rol.
  > Crea una nueva entidad de rol, asociándola con la compañía administradora, los permisos encontrados y el estado activo por defecto.
  > Guarda el nuevo rol en la base de datos.
  > Recupera el rol guardado, incluyendo sus relaciones con los permisos y el estado.
  > Retorna una respuesta de éxito con el rol creado y sus permisos asociados, o una respuesta de "no encontrado" si la compañía administradora o algún permiso no existen, o una respuesta de error si ocurre algún problema al obtener los permisos.
  > Maneja los errores que puedan ocurrir durante el proceso de creación.
    */
  async create(createRoleDto: CreateRoleDto) {
    try {
      const { admin_company_id, role_name, permissions_id } = createRoleDto;

      const existAdminCompany =
        await this.companiesService.findOne(admin_company_id);

      if (!existAdminCompany) {
        return notFoundResponse(`admin_company`);
      }

      await valueExistValidate(this.rolesRepository, 'role_name', role_name);

      const rolePermissions: Permissions[] = [];

      for (const permissionId of permissions_id) {
        const permissionResponse =
          await this.permissionsService.findOne(permissionId);

        if (!permissionResponse) {
          return notFoundResponse(`permission with id: ${permissionId}`);
        }

        if ('data' in permissionResponse) {
          rolePermissions.push(permissionResponse.data as Permissions);
        } else {
          return errorResponse(
            `Could not retrieve permission with id: ${permissionId}`,
            permissionResponse.message || 'Error fetching permission',
          );
        }
      }

      /* Valor activo por defecto */
      const defaultState = await this.statesService.findOne(
        /*
        * Estados disponibles para roles
          > rol_active      :id=11
          > rol_inactive      :id=12
          */
        11,
      );

      const newRole = this.rolesRepository.create({
        admin_company: { id_admin_company: admin_company_id },
        role_name,
        permissions: rolePermissions,
        state: defaultState,
      });

      const savedRole = await this.rolesRepository.save(newRole);

      const roleWithPermissions = await this.rolesRepository.findOne({
        where: { id_role: savedRole.id_role },
        relations: ['permissions', 'states'],
      });

      return successResponse(roleWithPermissions, 'Role created successfully');
    } catch (error) {
      return errorResponse(error, 'Error creating role');
    }
  }

  /*
    * Obtiene todos los roles con soporte para paginación opcional, 
    * incluyendo sus relaciones con la compañía administradora, los permisos y el estado.
  
  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los roles con sus relaciones.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados, incluyendo las relaciones.
  > Retorna una respuesta de éxito con los roles (paginados o no) y el total de roles si se pagina.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findAll(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const roles = await this.rolesRepository.find({
          relations: ['admin_company', 'permissions', 'states'],
        });

        return successResponse(roles, 'Roles retrieved successfully');
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [roles, total] = await this.rolesRepository.findAndCount({
          skip,
          take: limitNumber,
          relations: ['admin_company', 'permissions', 'states'],
        });

        return successResponse(
          { data: roles, total },
          'Paginated roles retrieved successfully',
        );
      }
    } catch (error) {
      return errorResponse(error, 'Error retrieving roles');
    }
  }

  /*
    * Obtiene todos los roles asociados a una compañía administradora específica 
    * con soporte para paginación opcional, incluyendo sus permisos y estado.
  
  > Verifica si la compañía administradora con el ID proporcionado existe.
  > Define la condición de búsqueda para filtrar por la compañía administradora.
  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los roles de la compañía con sus permisos y estado.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados, incluyendo los permisos y el estado.
  > Retorna una respuesta de éxito con los roles (paginados o no) y el total de roles si se pagina, o una respuesta de "no encontrado" si la compañía administradora no existe.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findAllByCompanyId(
    adminCompanyId: number,
    pageIndex?: number,
    limitNumber?: number,
  ) {
    try {
      const existAdminCompany =
        await this.companiesService.findOne(adminCompanyId);

      if (!existAdminCompany) {
        return notFoundResponse(`admin_company`);
      }

      const whereCondition = {
        admin_company: { id_admin_company: adminCompanyId },
      };

      if (pageIndex === undefined || limitNumber === undefined) {
        const roles = await this.rolesRepository.find({
          where: whereCondition,
          relations: ['permissions', 'states'],
        });

        return successResponse(
          roles,
          `Roles for admin company with id: ${adminCompanyId} retrieved successfully`,
        );
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [roles, total] = await this.rolesRepository.findAndCount({
          where: whereCondition,
          skip,
          take: limitNumber,
          relations: ['permissions', 'states'],
        });

        return successResponse(
          { data: roles, total },
          `Paginated roles for admin company ${adminCompanyId} retrieved successfully`,
        );
      }
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving roles for admin company ${adminCompanyId}`,
      );
    }
  }

  /*
    * Obtiene un rol específico por su ID, incluyendo sus relaciones 
    * con la compañía administradora, los permisos y el estado.

  > Busca el rol por su ID, incluyendo las relaciones especificadas.
  > Retorna una respuesta de éxito con el rol encontrado o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de obtención.
    */
  async findOne(id: number) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['admin_company', 'permissions', 'states'],
      });

      if (!role) {
        return notFoundResponse(`role`);
      }

      return successResponse(role, 'Role retrieved successfully');
    } catch (error) {
      return errorResponse(error, `Error retrieving role with id: ${id}`);
    }
  }

  /*
    * Actualiza un rol existente.

  > Verifica si el rol con el ID proporcionado existe, incluyendo sus permisos y estado actuales.
  > Valida si se proporciona al menos un campo para actualizar (nombre, permisos o estado).
  > Si se proporciona un nuevo nombre de rol, verifica si ya existe un rol con ese nombre (excluyendo el rol actual).
  > Si se proporciona una lista de IDs de permisos:
    > Identifica los nuevos permisos a agregar y los permisos existentes a remover.
    > Valida que todos los nuevos IDs de permisos existan.

  > Actualiza la relación del rol con los permisos, agregando los nuevos y removiendo los que no están en la lista actualizada.
  > Si se proporciona un ID de estado, verifica si el estado existe y actualiza el estado del rol.
  > Retorna una respuesta de éxito con el rol actualizado, incluyendo sus relaciones, o una respuesta de "no encontrado" o "conflicto" según sea necesario.
  > Maneja posibles errores durante el proceso de actualización.
    */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const existingRole = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['permissions', 'states'],
      });

      if (!existingRole) {
        return notFoundResponse(`role`);
      }

      const { role_name, permissions_id, state_id } = updateRoleDto;

      if (!role_name && !permissions_id && !state_id) {
        emptyDataResponse([role_name, permissions_id, String(state_id)]);
      }

      const updateData: Partial<Roles> = {};

      await valueExistValidate(this.rolesRepository, 'role_name', role_name);
      updateData.role_name = role_name;

      //> Obtener los IDs de los permisos existentes del rol
      const existingPermissionIds = existingRole.permissions.map(
        (permission) => permission.id_permission,
      );

      //> Filtrar los IDs de los permisos que son nuevos
      // (no están en existingRole)
      const newPermissionIds = permissions_id.filter(
        (permissionId) => !existingPermissionIds.includes(permissionId),
      );

      //> Filtrar los IDs de los permisos que deben ser removidos
      // (están en existingRole pero no en permissions_id)
      const removedPermissionIds = existingPermissionIds.filter(
        (existingId) => !permissions_id.includes(existingId),
      );

      const newPermissions: Permissions[] = [];

      for (const permissionId of newPermissionIds) {
        const permissionResponse =
          await this.permissionsService.findOne(permissionId);

        if ('data' in permissionResponse) {
          newPermissions.push(permissionResponse.data as Permissions);

          //% TypeORM maneja la adición y eliminación en relaciones @ManyToMany
          //> Simplemente asigna el nuevo array de permisos
          updateData.permissions = [
            ...existingRole.permissions.filter(
              (p) => !removedPermissionIds.includes(p.id_permission),
            ),
            ...newPermissions,
          ];
        } else {
          return errorResponse(
            `Could not retrieve permission with id: ${permissionId}`,
            permissionResponse.message || 'Error fetching permission',
          );
        }
      }

      const newState = await this.statesService.findOne(state_id);

      if (newState) {
        updateData.state = newState;
      } else {
        return notFoundResponse('state_id');
      }

      await this.rolesRepository.update(id, updateData);

      const updatedRole = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['admin_company', 'permissions', 'states'],
      });

      return successResponse(updatedRole, 'Role updated successfully');
    } catch (error) {
      return errorResponse(error, `Error updating role with id: ${id}`);
    }
  }

  /*
    * Elimina un rol específico por su ID.

  > Verifica si el rol con el ID proporcionado existe, incluyendo sus permisos asociados.
  > Si el rol tiene permisos asociados, retorna una respuesta de conflicto indicando que los permisos deben ser removidos primero.
  > Si el rol no tiene permisos asociados, elimina el rol.
  > Retorna una respuesta de éxito tras la eliminación o una respuesta de "no encontrado" si el ID no existe, o una respuesta de conflicto si el rol tiene permisos asociados.
  > Maneja posibles errores durante el proceso de eliminación.
    */
  async remove(id: number) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['permissions'],
      });

      if (!role) {
        return notFoundResponse(`role`);
      }

      if (role.permissions && role.permissions.length > 0) {
        return conflictResponse(
          'role',
          'is associated with permissions and cannot be deleted directly. Remove permissions from the role first.',
        );
      }

      await this.rolesRepository.delete(id);
      return successResponse(null, 'Role deleted successfully');
    } catch (error) {
      return errorResponse(error, `Error deleting role with id: ${id}`);
    }
  }
}
