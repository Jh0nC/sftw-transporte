import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from 'src/database';
import { errorResponse, notFoundResponse } from 'src/utils';
import { AdminCompaniesService } from 'src/integrations';

@Injectable()
export class FindAllRolesByCompanyService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private readonly adminCompaniesService: AdminCompaniesService,
  ) {}

  async exec(adminCompanyId: number, pageIndex?: number, limitNumber?: number) {
    try {
      const existAdminCompany =
        await this.adminCompaniesService.findOne(adminCompanyId);

      if (!existAdminCompany) {
        notFoundResponse(`admin_company`);
      }

      const whereCondition = {
        admin_company: { id_admin_company: adminCompanyId },
      };

      if (pageIndex === undefined || limitNumber === undefined) {
        const roles = await this.rolesRepository.find({
          where: whereCondition,
          relations: ['permissions', 'state'],
        });

        return roles;
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [roles, total] = await this.rolesRepository.findAndCount({
          where: whereCondition,
          skip,
          take: limitNumber,
          relations: ['permissions', 'state'],
        });

        return { data: roles, total };
      }
    } catch (error) {
      errorResponse(
        error,
        `Error retrieving roles for admin company ${adminCompanyId}`,
      );
    }
  }
}
