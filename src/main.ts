import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const HTTP_STATUS_UNPROCESSABLE_ENTITY: number = 422;
  app.useGlobalPipes(new ValidationPipe({transform: true, errorHttpStatusCode: HTTP_STATUS_UNPROCESSABLE_ENTITY}));
  await app.listen(3000);
}
bootstrap();
