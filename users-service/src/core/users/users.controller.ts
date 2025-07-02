import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import {
  FindAllUsersService,
  FindOneUserService,
  FindAllUsersByCompanyService,
  FindallUsersByDocumentTypeService,
  FindAllDriversService,
  FindAllDriversByCompanyService,
  FindAllAdministrativeUsersService,
  FindAllAdministrativeUsersByCompanyService,
  UpdateUserService,
  DeleteUserService,
} from './services';
import { UpdateUserDto } from './dto/';

@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsers: FindAllUsersService,
    private readonly findOneUser: FindOneUserService,
    private readonly findAllUsersByCompany: FindAllUsersByCompanyService,
    private readonly findallUsersByDocumentType: FindallUsersByDocumentTypeService,
    private readonly findAllUsersDrivers: FindAllDriversService,
    private readonly findAllUsersDriversByCompany: FindAllDriversByCompanyService,
    private readonly findAllUsersAdministratives: FindAllAdministrativeUsersService,
    private readonly findAllUsersAdministrativesByCompany: FindAllAdministrativeUsersByCompanyService,
    private readonly updateUser: UpdateUserService,
    private readonly deleteUser: DeleteUserService,
  ) {}

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllUsers.exec(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOneUser.exec(id);
  }

  @Get('by-company/:id')
  findAllByCompany(
    @Param('id') adminCompanyId: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllUsersByCompany.exec(
      adminCompanyId,
      pageIndex,
      limitNumber,
    );
  }

  @Get('by-coument-type/:id')
  findAllByDocumentType(
    @Param('id') documentTypeId: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findallUsersByDocumentType.exec(
      documentTypeId,
      pageIndex,
      limitNumber,
    );
  }

  @Get('drivers/:id')
  findAllDrivers(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllUsersDrivers.exec(pageIndex, limitNumber);
  }

  @Get('drivers-by-company/:id')
  findAllDriversByCompany(
    @Param('id') adminCompanyId: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllUsersDriversByCompany.exec(
      adminCompanyId,
      pageIndex,
      limitNumber,
    );
  }

  @Get('admin-users/:id')
  findAllAdministratives(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllUsersAdministratives.exec(pageIndex, limitNumber);
  }

  @Get('admin-users-by-company/:id')
  findAllAdministrativesByCompany(
    @Param('id') adminCompanyId: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllUsersAdministrativesByCompany.exec(
      adminCompanyId,
      pageIndex,
      limitNumber,
    );
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUser.exec(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.deleteUser.exec(id);
  }
}
