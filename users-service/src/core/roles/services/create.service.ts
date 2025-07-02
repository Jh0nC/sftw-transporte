import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions, Roles } from 'src/database';
import { conflictResponse, errorResponse, notFoundResponse } from 'src/utils';
import { AdminCompaniesService, StatesService } from 'src/integrations';
import { FindOnePermissionService } from 'src/core/permissions/services';
import { CreateRoleDto } from '../dto';

@Injectable()
export class CreateRoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private readonly adminCompaniesService: AdminCompaniesService,
    private readonly statesService: StatesService,
    private readonly findOnePermission: FindOnePermissionService,
  ) {}

  async exec(adminCompanyId: number, createRoleDto: CreateRoleDto) {
    try {
      const { role_name, permissions_id } = createRoleDto;
      const toCreateRole: Partial<Roles> = {};

      const currentAdminCompany =
        await this.adminCompaniesService.findOne(adminCompanyId);

      toCreateRole.admin_company = currentAdminCompany;

      const roleNameExists = await this.rolesRepository.findOneBy({
        role_name,
      });

      if (roleNameExists) {
        conflictResponse('role_name', 'already exists');
      } else {
        toCreateRole.role_name = role_name;
      }

      const rolePermissions: Permissions[] = [];
      for (const permissionId of permissions_id) {
        const toAddPermission = await this.findOnePermission.exec(permissionId);

        if (toAddPermission === null || toAddPermission === undefined) {
          notFoundResponse(`permission with id: ${permissionId}`);
        }

        rolePermissions.push(toAddPermission as Permissions);
      }
      toCreateRole.permissions = rolePermissions;

      const defaultRoleState = await this.statesService.findOne(
        /* 
        * Valor del estado del Rol por defecto: Activo
        > {rol_active, id: 110} 
        */
        110,
      );
      toCreateRole.state = defaultRoleState;

      const newRole = this.rolesRepository.create(toCreateRole);
      const savedRole = await this.rolesRepository.save(newRole);

      const newRoleWithPermissions = await this.rolesRepository.findOne({
        where: { id_role: savedRole.id_role },
        relations: ['permissions', 'state'],
      });

      return newRoleWithPermissions;
    } catch (error) {
      errorResponse(error, 'Error creating role');
    }
  }
}
