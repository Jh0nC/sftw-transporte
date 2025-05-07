import { Module } from '@nestjs/common';
import { ClientCompaniesService } from './client-companies.service';
import { ClientCompaniesController } from './client-companies.controller';

@Module({
  controllers: [ClientCompaniesController],
  providers: [ClientCompaniesService],
})
export class ClientCompaniesModule {}
