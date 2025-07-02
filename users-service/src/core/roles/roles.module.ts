import { forwardRef, Module } from '@nestjs/common';
import * as RolesServices from './services';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/database';
import { PermissionsModule } from 'src/core';
import { HttpModule } from '@nestjs/axios';
import * as IntegrationServices from 'src/integrations';
import * as PermissionsServices from '../permissions/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles]),
    forwardRef(() => PermissionsModule),
    HttpModule,
  ],
  controllers: [RolesController],
  providers: [
    ...Object.values(RolesServices),
    ...Object.values(PermissionsServices),
    ...Object.values(IntegrationServices),
  ],
  exports: [TypeOrmModule],
})
export class RolesModule {}
