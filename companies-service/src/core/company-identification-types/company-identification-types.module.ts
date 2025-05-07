import { forwardRef, Module } from '@nestjs/common';
import { CompanyIdentificationTypesService } from './company-identification-types.service';
import { CompanyIdentificationTypesController } from './company-identification-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypes } from 'src/database';
import {
  AdminCompaniesModule,
  ClientCompaniesModule,
} from 'src/core/index.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentTypes]),
    forwardRef(() => AdminCompaniesModule),
    forwardRef(() => ClientCompaniesModule),
  ],
  controllers: [CompanyIdentificationTypesController],
  providers: [CompanyIdentificationTypesService],
  exports: [TypeOrmModule],
})
export class CompanyIdentificationTypesModule {}
