import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from 'src/database';
import { errorResponse } from 'src/utils';

@Injectable()
export class FindAllPermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
  ) {}

  async exec(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const permissions = await this.permissionsRepository.find({
          relations: ['state'],
        });

        return permissions;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [permissions, total] =
          await this.permissionsRepository.findAndCount({
            skip,
            take: limitNumber,
          });

        return { data: permissions, total };
      }
    } catch (error) {
      errorResponse(error, 'Error retrieving permissions');
    }
  }
}
