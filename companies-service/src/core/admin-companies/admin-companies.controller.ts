import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminCompaniesService } from './admin-companies.service';
import { CreateAdminCompanyDto } from './dto/create-admin-company.dto';
import { UpdateAdminCompanyDto } from './dto/update-admin-company.dto';

@Controller('admin-companies')
export class AdminCompaniesController {
  constructor(private readonly adminCompaniesService: AdminCompaniesService) {}

  @Post()
  create(@Body() createAdminCompanyDto: CreateAdminCompanyDto) {
    return this.adminCompaniesService.create(createAdminCompanyDto);
  }

  @Get()
  findAll() {
    return this.adminCompaniesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminCompaniesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminCompanyDto: UpdateAdminCompanyDto) {
    return this.adminCompaniesService.update(+id, updateAdminCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminCompaniesService.remove(+id);
  }
}
