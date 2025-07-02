import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVariables } from './config';
// import { (ModulesCreatednAPI) } from './...';
// import { (EntitiesUsedOnAPI) } from './...';

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
      entities: [/* (EntitiesUsedOnAPI) */],
    }),
    /* (ModulesCreatedOnAPI)... */,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}