import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from 'src/database';
import { errorResponse } from 'src/utils';

@Injectable()
export class FindAllRolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async exec(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const roles = await this.rolesRepository.find({
          relations: ['admin_company', 'permissions', 'state'],
        });

        return roles;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [roles, total] = await this.rolesRepository.findAndCount({
          skip,
          take: limitNumber,
          relations: ['admin_company', 'permissions', 'state'],
        });

        return { data: roles, total };
      }
    } catch (error) {
      errorResponse(error, 'Error retrieving roles');
    }
  }
}
