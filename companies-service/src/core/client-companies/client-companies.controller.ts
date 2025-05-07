import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientCompaniesService } from './client-companies.service';
import { CreateClientCompanyDto } from './dto/create-client-company.dto';
import { UpdateClientCompanyDto } from './dto/update-client-company.dto';

@Controller('client-companies')
export class ClientCompaniesController {
  constructor(private readonly clientCompaniesService: ClientCompaniesService) {}

  @Post()
  create(@Body() createClientCompanyDto: CreateClientCompanyDto) {
    return this.clientCompaniesService.create(createClientCompanyDto);
  }

  @Get()
  findAll() {
    return this.clientCompaniesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientCompaniesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientCompanyDto: UpdateClientCompanyDto) {
    return this.clientCompaniesService.update(+id, updateClientCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientCompaniesService.remove(+id);
  }
}
