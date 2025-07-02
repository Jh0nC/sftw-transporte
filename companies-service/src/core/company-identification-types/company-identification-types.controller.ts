import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import {
  FindAllCompanyIdentificationTypesService,
  FindOneCompanyIdentificationTypesService,
  FindAllAdminCompaniesWithIdentificationTypeService,
  UpdateCompanyIdentificationTypeService,
} from './services';
import { UpdateCompanyIdentificationTypeDto } from './dto/';

@Controller('company-identification-types')
export class CompanyIdentificationTypesController {
  constructor(
    private readonly findAllCompanyIdentificationTypes: FindAllCompanyIdentificationTypesService,
    private readonly findOneCompanyIdentificationType: FindOneCompanyIdentificationTypesService,
    private readonly findAllAdminCompaniesWithIdentificationType: FindAllAdminCompaniesWithIdentificationTypeService,
    private readonly updateCompanyIdentificationType: UpdateCompanyIdentificationTypeService,
  ) {}

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllCompanyIdentificationTypes.exec(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOneCompanyIdentificationType.exec(id);
  }

  @Get('admin-companies/:id')
  findAllAdminWithIdentificationType(
    @Param('id') id: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllAdminCompaniesWithIdentificationType.exec(
      id,
      pageIndex,
      limitNumber,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body()
    updateCompanyIdentificationTypeDto: UpdateCompanyIdentificationTypeDto,
  ) {
    return this.updateCompanyIdentificationType.exec(
      id,
      updateCompanyIdentificationTypeDto,
    );
  }
}
