import { Module } from '@nestjs/common';
import { DocumentTypesController } from './document-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypes } from 'src/database';
import * as DocumentTypesServices from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTypes])],
  controllers: [DocumentTypesController],
  providers: Object.values(DocumentTypesServices),
  exports: [TypeOrmModule],
})
export class DocumentTypesModule {}
