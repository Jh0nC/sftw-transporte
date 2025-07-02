import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from 'src/database';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class FindAllRolesWithPermissionService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
  ) {}

  async exec(id: number) {
    try {
      const permissionWithRoles = await this.permissionsRepository.findOne({
        where: { id_permission: id },
        relations: ['roles', 'state'],
      });

      if (!permissionWithRoles) {
        notFoundResponse('id_permission');
      }

      return permissionWithRoles;
    } catch (error) {
      errorResponse(error, `Error retrieving roles with permission ID: ${id}`);
    }
  }
}
