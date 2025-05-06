import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVariables } from './config';
import {
  DocumentTypesModule,
  UsersModule,
  RolesModule,
  PermissionsModule,
} from './core/';
import * as entities from './database';

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
      /*
        Se utiliza Object.values(entities) para extraer todas las clases de entidad
        exportadas desde el archivo 'src/database/index.ts'.
        */
      entities: Object.values(entities),
    }),
    DocumentTypesModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
