import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.permissionsService.findAll(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.permissionsService.findOne(id);
  }

  @Get('roles-with/:id')
  findRolesWithPermission(
    @Param('id') id: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.permissionsService.findRolesWithPermission(
      id,
      pageIndex,
      limitNumber,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.permissionsService.remove(id);
  }
}
