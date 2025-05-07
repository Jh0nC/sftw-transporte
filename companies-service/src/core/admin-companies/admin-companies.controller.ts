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
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.adminCompaniesService.findAll(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.adminCompaniesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAdminCompanyDto: UpdateAdminCompanyDto,
  ) {
    return this.adminCompaniesService.update(id, updateAdminCompanyDto);
  }
}
