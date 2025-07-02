import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions, Roles } from 'src/database';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
} from 'src/utils';
import { StatesService } from 'src/integrations';
import { FindOnePermissionService } from 'src/core/permissions/services';
import { UpdateRoleDto } from '../dto/';

@Injectable()
export class UpdateRoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private readonly statesService: StatesService,
    private readonly findOnePermission: FindOnePermissionService,
  ) {}

  async exec(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const currentRole = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['permissions', 'state', 'admin_company'],
      });

      if (!currentRole) {
        notFoundResponse(`id_role`);
      }

      const { role_name, permissions_id, state_id } = updateRoleDto;

      if (!role_name && !permissions_id && !state_id) {
        emptyDataResponse(String(Object.keys(UpdateRoleDto)));
      }

      const toUpdateRole: Partial<Roles> = {};

      if (role_name !== undefined) {
        const roleNameExists = await this.rolesRepository.findOneBy({
          role_name,
        });

        if (roleNameExists && roleNameExists.id_role !== id) {
          conflictResponse('role_name', 'already exists');
        }
      } else {
        toUpdateRole.role_name = currentRole?.role_name;
      }

      if (permissions_id !== undefined) {
        const currentPermissions = currentRole?.permissions || [];

        const existingPermissionIds = currentPermissions.map(
          (permission) => permission.id_permission,
        );

        const newPermissionIds = permissions_id.filter(
          (permissionId) => !existingPermissionIds.includes(permissionId),
        );

        const removedPermissionIds = existingPermissionIds.filter(
          (existingId) => !permissions_id.includes(existingId),
        );

        const remainingPermissions = currentPermissions.filter(
          (p) => !removedPermissionIds.includes(p.id_permission),
        );

        const newPermissions: Permissions[] = [];

        for (const permissionId of newPermissionIds) {
          const toAddPermission =
            await this.findOnePermission.exec(permissionId);

          if (toAddPermission === null || toAddPermission === undefined) {
            notFoundResponse(`permission with id: ${permissionId}`);
          }

          newPermissions.push(toAddPermission as Permissions);
        }

        toUpdateRole.permissions = [...remainingPermissions, ...newPermissions];
      } else {
        toUpdateRole.permissions = currentRole?.permissions;
      }

      if (state_id !== undefined) {
        const newState = await this.statesService.findOne(state_id);

        toUpdateRole.state = newState;
      } else {
        toUpdateRole.state = currentRole?.state;
      }

      await this.rolesRepository.update(id, toUpdateRole);

      const updatedRole = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['permissions', 'state', 'admin_company'],
      });

      return updatedRole;
    } catch (error) {
      errorResponse(error, `Error updating role with id: ${id}`);
    }
  }
}
