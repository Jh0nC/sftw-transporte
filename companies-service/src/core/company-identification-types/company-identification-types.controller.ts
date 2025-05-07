import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyIdentificationTypesService } from './company-identification-types.service';
import { CreateCompanyIdentificationTypeDto } from './dto/create-company-identification-type.dto';
import { UpdateCompanyIdentificationTypeDto } from './dto/update-company-identification-type.dto';

@Controller('company-identification-types')
export class CompanyIdentificationTypesController {
  constructor(private readonly companyIdentificationTypesService: CompanyIdentificationTypesService) {}

  @Post()
  create(@Body() createCompanyIdentificationTypeDto: CreateCompanyIdentificationTypeDto) {
    return this.companyIdentificationTypesService.create(createCompanyIdentificationTypeDto);
  }

  @Get()
  findAll() {
    return this.companyIdentificationTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyIdentificationTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyIdentificationTypeDto: UpdateCompanyIdentificationTypeDto) {
    return this.companyIdentificationTypesService.update(+id, updateCompanyIdentificationTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyIdentificationTypesService.remove(+id);
  }
}
