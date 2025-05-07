import { forwardRef, Module } from '@nestjs/common';
import { AdminCompaniesService } from './admin-companies.service';
import { AdminCompaniesController } from './admin-companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCompanies } from 'src/database';
import { CompanyIdentificationTypesModule } from 'src/core/index.module';
import { CompanyIdentificationTypesService } from 'src/core/index.service';
import { UsersService } from 'src/integrations';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminCompanies]),
    forwardRef(() => CompanyIdentificationTypesModule),
  ],
  controllers: [AdminCompaniesController],
  providers: [
    AdminCompaniesService,
    CompanyIdentificationTypesService,
    UsersService,
  ],
  exports: [TypeOrmModule],
})
export class AdminCompaniesModule {}
