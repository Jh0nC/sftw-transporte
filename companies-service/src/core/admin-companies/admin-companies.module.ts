import { Module } from '@nestjs/common';
import { AdminCompaniesService } from './admin-companies.service';
import { AdminCompaniesController } from './admin-companies.controller';

@Module({
  controllers: [AdminCompaniesController],
  providers: [AdminCompaniesService],
})
export class AdminCompaniesModule {}
