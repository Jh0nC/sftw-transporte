import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envVariables } from './config';

// Controllers
import { HealthController } from './health/health.controller';
import { GatewayController } from './gateway/gateway.controller';

// Services
import { ServiceRegistryService } from './registry/service-registry.service';
import { ProxyService } from './proxy/proxy.service';

// Middleware & Guards
import { AuthMiddleware } from './middleware/auth.middleware';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      load: [envVariables],
      isGlobal: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),

    // HTTP Client for proxying requests
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),

    // JWT Configuration
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '15m' },
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [
    AppController,
    HealthController,
    GatewayController,
  ],
  providers: [
    AppService,
    ServiceRegistryService,
    ProxyService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/health', method: RequestMethod.GET },
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
