import { forwardRef, Module } from '@nestjs/common';
import * as AdminCompaniesServices from './services/';
import { AdminCompaniesController } from './admin-companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCompanies } from 'src/database';
import { CompanyIdentificationTypesModule } from 'src/core';
import { HttpModule } from '@nestjs/axios';
import * as CompanyIdentificationTypesServices from '../company-identification-types/services/';
import * as IntegrationServices from 'src/integrations';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminCompanies]),
    forwardRef(() => CompanyIdentificationTypesModule),
    HttpModule,
  ],
  controllers: [AdminCompaniesController],
  providers: [
    ...Object.values(AdminCompaniesServices),
    ...Object.values(CompanyIdentificationTypesServices),
    ...Object.values(IntegrationServices),
  ],
  exports: [TypeOrmModule],
})
export class AdminCompaniesModule {}
