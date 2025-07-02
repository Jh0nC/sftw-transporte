import { forwardRef, Module } from '@nestjs/common';
import * as CompanyIdentificationTypesService from './services';
import { CompanyIdentificationTypesController } from './company-identification-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyIdentificationType } from 'src/database';
import { AdminCompaniesModule, ClientCompaniesModule } from 'src/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyIdentificationType]),
    forwardRef(() => AdminCompaniesModule),
    forwardRef(() => ClientCompaniesModule),
  ],
  controllers: [CompanyIdentificationTypesController],
  providers: [...Object.values(CompanyIdentificationTypesService)],
  exports: [TypeOrmModule],
})
export class CompanyIdentificationTypesModule {}
