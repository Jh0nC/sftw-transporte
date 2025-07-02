import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from 'src/database';
import { errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class FindOneRoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async exec(id: number) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['admin_company', 'permissions', 'state'],
      });

      if (!role) {
        notFoundResponse(`role`);
      }

      return role;
    } catch (error) {
      errorResponse(error, `Error retrieving role with id: ${id}`);
    }
  }
}
