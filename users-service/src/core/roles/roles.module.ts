import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/database';
import { PermissionsModule } from 'src/core/index.module';
import { AdminCompaniesService, StatesService } from 'src/integrations';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles]),
    forwardRef(() => PermissionsModule),
    StatesService,
    AdminCompaniesService
  ],
  controllers: [RolesController],
  providers: [RolesService, StatesService],
  exports: [TypeOrmModule],
})
export class RolesModule {}
