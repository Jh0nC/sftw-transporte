import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envVariables } from './config';

async function main() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  await app.listen(envVariables.appPort);

}
main();