import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');

  // Validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina campos no declarados en el DTO
    forbidNonWhitelisted: true, // Lanza error si llegan campos extra
    transform: true, // Transforma tipos automáticamente
  }));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  })

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
