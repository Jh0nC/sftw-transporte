import { Module } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypes } from 'src/database';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTypes])],
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
  exports: [TypeOrmModule]
})
export class DocumentTypesModule {}
