import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from "@nestjs/platform-express";
import { photoConfig } from 'config/photo';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(photoConfig.destination, {
    prefix: photoConfig.prefix
  })
  await app.listen(3000);
}
bootstrap();
