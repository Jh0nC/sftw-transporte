import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from 'src/database';
import { conflictResponse, errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class DeleteRoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async exec(id: number) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id_role: id },
        relations: ['permissions', 'users'],
      });

      if (!role) {
        notFoundResponse(`role`);
      }

      if (
        (role?.permissions && role?.permissions.length > 0) ||
        (role?.users && role?.users.length > 0)
      ) {
        conflictResponse(
          'role',
          `is associated with many records and cannot be deleted directly. 
          Remove from the records first.`,
        );
      }

      await this.rolesRepository.delete(id);

      return { message: `Role with id:${id} deleted successfully` };
    } catch (error) {
      errorResponse(error, `Error deleting role with id: ${id}`);
    }
  }
}
