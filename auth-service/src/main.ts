import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envVariables } from 'src/config';

async function main() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(envVariables.appPort);
  Logger.log(
    `App is running on port ${envVariables.appPort}, url: http://localhost:${envVariables.appPort}`,
  );
}
main();
