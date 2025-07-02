import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVariables } from './config';
import {
  AdminCompaniesModule,
  ClientCompaniesModule,
  CompanyIdentificationTypesModule,
} from 'src/core';
import * as entities from 'src/database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      logging: true,
      synchronize: false,
      host: envVariables.dbHost,
      port: envVariables.dbPort,
      username: envVariables.dbUsername,
      password: envVariables.dbPassword,
      database: envVariables.dbName,
      entities: Object.values(entities),
    }),
    AdminCompaniesModule,
    ClientCompaniesModule,
    CompanyIdentificationTypesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
