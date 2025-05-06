import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVariables } from './config';
import { StatesModule } from './states/states.module';
import { States } from './states/entities/index';

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
      entities: [States],
    }),
    StatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
