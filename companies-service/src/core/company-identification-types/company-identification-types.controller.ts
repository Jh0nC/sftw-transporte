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
import { CompanyIdentificationTypesService } from './company-identification-types.service';
import { CreateCompanyIdentificationTypeDto } from './dto/create-company-identification-type.dto';
import { UpdateCompanyIdentificationTypeDto } from './dto/update-company-identification-type.dto';

@Controller('company-identification-types')
export class CompanyIdentificationTypesController {
  constructor(
    private readonly companyIdentificationTypesService: CompanyIdentificationTypesService,
  ) {}

  @Post()
  create(
    @Body()
    createCompanyIdentificationTypeDto: CreateCompanyIdentificationTypeDto,
  ) {
    return this.companyIdentificationTypesService.create(
      createCompanyIdentificationTypeDto,
    );
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.companyIdentificationTypesService.findAll(
      pageIndex,
      limitNumber,
    );
  }

  @Get('admin-companies/:id')
  findAllAdminNamesWithIdentificationType(@Param('id') id: number) {
    return this.companyIdentificationTypesService.findAllAdminNamesWithIdentificationType(
      id,
    );
  }

  @Get('client-companies/:id')
  findAllClientsNamesWithIdentificationType(@Param('id') id: number) {
    return this.companyIdentificationTypesService.findAllClientsNamesWithIdentificationType(
      id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.companyIdentificationTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body()
    updateCompanyIdentificationTypeDto: UpdateCompanyIdentificationTypeDto,
  ) {
    return this.companyIdentificationTypesService.update(
      id,
      updateCompanyIdentificationTypeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companyIdentificationTypesService.remove(id);
  }
}
