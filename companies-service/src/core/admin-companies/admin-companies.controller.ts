import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import {
  CreateAdminCompanyService,
  FindAllAdminCompaniesService,
  FindOneAdminCompanyService,
  UpdateAdminCompanyService,
  DeleteAdminCompanyService,
} from './services';
import { CreateAdminCompanyDto, UpdateAdminCompanyDto } from './dto/';

@Controller('admin-companies')
export class AdminCompaniesController {
  constructor(
    private readonly createAdminCompany: CreateAdminCompanyService,
    private readonly findAllAdminCompanies: FindAllAdminCompaniesService,
    private readonly findOneAdminCompany: FindOneAdminCompanyService,
    private readonly updateAdminCompany: UpdateAdminCompanyService,
    private readonly deleteAdminCompany: DeleteAdminCompanyService,
  ) {}

  @Post()
  create(@Body() createAdminCompanyDto: CreateAdminCompanyDto) {
    return this.createAdminCompany.exec(createAdminCompanyDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllAdminCompanies.exec(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOneAdminCompany.exec(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateAdminCompanyDto: UpdateAdminCompanyDto,
  ) {
    return this.updateAdminCompany.exec(id, updateAdminCompanyDto);
  }

  @Delete()
  delete(@Param('id') id: number) {
    return this.deleteAdminCompany.exec(id);
  }
}
