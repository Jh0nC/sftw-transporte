import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions, States } from 'src/database';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
} from 'src/utils';
import { StatesService } from 'src/integrations';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class UpdatePermissionService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    private readonly statesService: StatesService,
  ) {}

  async exec(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const currentPermission = await this.permissionsRepository.findOneBy({
        id_permission: id,
      });

      if (!currentPermission) {
        notFoundResponse('id_permission');
      }

      const { permission_name, description, state_id } = updatePermissionDto;

      if (!permission_name && !description && state_id === undefined) {
        emptyDataResponse(String(Object.keys(UpdatePermissionDto)));
      }

      const toUpdatePermission: Partial<Permissions> = {};

      if (permission_name !== undefined) {
        const permissionNameExist = await this.permissionsRepository.findOneBy({
          permission_name,
        });

        if (permissionNameExist && permissionNameExist.id_permission !== id) {
          conflictResponse('permission_name', 'already exists');
        }
      } else {
        toUpdatePermission.permission_name = currentPermission?.permission_name;
      }

      if (description !== undefined) {
        toUpdatePermission.description = description;
      } else {
        toUpdatePermission.description = currentPermission?.description;
      }

      if (state_id !== undefined) {
        const newState = await this.statesService.findOne(state_id);

        toUpdatePermission.state = newState as States;
      } else {
        toUpdatePermission.state = currentPermission?.state;
      }

      await this.permissionsRepository.update(id, toUpdatePermission);

      const updatedPermission = await this.permissionsRepository.findOne({
        where: { id_permission: id },
        relations: ['state'],
      });

      return updatedPermission;
    } catch (error) {
      errorResponse(error, `Error updating permission with id: ${id}`);
    }
  }
}
