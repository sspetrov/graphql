import { NestFactory } from '@nestjs/core';
import { MainAppModule } from './main.app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MainAppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.listen(3000);
}

bootstrap();
