import { Controller, Get, Body, Param, Query, Put } from '@nestjs/common';
import {
  FindAllPermissionsService,
  FindOnePermissionService,
  FindAllRolesWithPermissionService,
  UpdatePermissionService,
} from './services';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly findAllPermissions: FindAllPermissionsService,
    private readonly findOnePermission: FindOnePermissionService,
    private readonly findAllRolesWithPermission: FindAllRolesWithPermissionService,
    private readonly updatePermission: UpdatePermissionService,
  ) {}

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllPermissions.exec(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOnePermission.exec(id);
  }

  @Get('roles-with/:id')
  findRolesWithPermission(@Param('id') id: number) {
    return this.findAllRolesWithPermission.exec(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.updatePermission.exec(id, updatePermissionDto);
  }
}
