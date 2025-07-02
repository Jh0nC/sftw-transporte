import { forwardRef, Module } from '@nestjs/common';
import * as PermissionsServices from './services';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from 'src/database';
import { HttpModule } from '@nestjs/axios';
import { RolesModule } from 'src/core';
import { StatesService } from 'src/integrations';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permissions]),
    forwardRef(() => RolesModule),
    HttpModule,
  ],
  controllers: [PermissionsController],
  providers: [...Object.values(PermissionsServices), StatesService],
  exports: [TypeOrmModule],
})
export class PermissionsModule {}
