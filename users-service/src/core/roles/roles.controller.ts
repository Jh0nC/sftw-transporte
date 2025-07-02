import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Put,
} from '@nestjs/common';
import {
  CreateRoleService,
  DeleteRoleService,
  FindAllRolesByCompanyService,
  FindAllRolesService,
  FindOneRoleService,
  UpdateRoleService,
} from './services';
import { CreateRoleDto, UpdateRoleDto } from './dto/';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRole: CreateRoleService,
    private readonly findAllRoles: FindAllRolesService,
    private readonly findOneRole: FindOneRoleService,
    private readonly findAllRolesByCompany: FindAllRolesByCompanyService,
    private readonly updateRole: UpdateRoleService,
    private readonly deleteRole: DeleteRoleService,
  ) {}

  @Post()
  create(
    @Query('admin-company-id') adminCompanyId: number,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.createRole.exec(adminCompanyId, createRoleDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllRoles.exec(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOneRole.exec(id);
  }

  @Get('by-company/:id')
  findAllByCompanyId(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Param('id') companyId: number,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllRolesByCompany.exec(companyId, pageIndex, limitNumber);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.updateRole.exec(id, updateRoleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.deleteRole.exec(id);
  }
}
