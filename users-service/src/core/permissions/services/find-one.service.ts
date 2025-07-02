import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from 'src/database';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class FindOnePermissionService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
  ) {}

  async exec(id: number) {
    try {
      const permission = await this.permissionsRepository.findOne({
        where: { id_permission: id },
        relations: ['state'],
      });

      if (!permission) {
        notFoundResponse('id_permission');
      }

      return permission;
    } catch (error) {
      errorResponse(error, `Error retrieving permission with id: ${id}`);
    }
  }
}
