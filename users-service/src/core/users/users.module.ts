import { Module } from '@nestjs/common';
import * as UsersServices from './services';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Drivers,
  UserAdministratives,
  Users,
  UsersSecondaryData,
} from 'src/database';
import { HttpModule } from '@nestjs/axios';
import * as IntegrationServices from 'src/integrations';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UsersSecondaryData,
      Drivers,
      UserAdministratives,
    ]),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [
    ...Object.values(UsersServices),
    ...Object.values(IntegrationServices),
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
