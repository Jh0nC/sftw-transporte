import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVariables } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
      host: envVariables.dbHost,
      port: envVariables.dbPort,
      username: envVariables.dbUsername,
      password: envVariables.dbPassword,
      database: envVariables.dbName,
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
