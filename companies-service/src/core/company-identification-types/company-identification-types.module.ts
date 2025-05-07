import { Module } from '@nestjs/common';
import { CompanyIdentificationTypesService } from './company-identification-types.service';
import { CompanyIdentificationTypesController } from './company-identification-types.controller';

@Module({
  controllers: [CompanyIdentificationTypesController],
  providers: [CompanyIdentificationTypesService],
})
export class CompanyIdentificationTypesModule {}
