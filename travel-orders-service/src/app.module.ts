import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envVariables, envSchema } from './config';

// Entities
import { TravelOrder, TravelOrderStop, TravelOrderTracking } from './entities';

// Controllers
import { TravelOrdersController } from './controllers';

// Services
import { TravelOrdersService } from './services';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      load: [envVariables],
      validationSchema: envSchema,
      isGlobal: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),

    // Database Configuration
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [TravelOrder, TravelOrderStop, TravelOrderTracking],
        synchronize: configService.get('nodeEnv') === 'development',
        logging: configService.get('nodeEnv') === 'development',
      }),
      inject: ['ConfigService'],
    }),

    // TypeORM Feature
    TypeOrmModule.forFeature([TravelOrder, TravelOrderStop, TravelOrderTracking]),

    // HTTP Client for external services
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController, TravelOrdersController],
  providers: [AppService, TravelOrdersService],
  exports: [TravelOrdersService],
})
export class AppModule {}
