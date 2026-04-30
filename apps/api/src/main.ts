import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');

  // Validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos no declarados en el DTO
      forbidNonWhitelisted: true, // Lanza error si llegan campos extra
      transform: true, // Transforma tipos automáticamente
    }),
  );

  // Swagger solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Ecommerce API')
      .setDescription('API para tienda de productos personalizados')
      .setVersion('1.0')
      .addBearerAuth() // habilita el botón Authorize con JWT
      .build();

    const document = SwaggerModule.createDocument(app as any, config);
    SwaggerModule.setup('api/docs', app as any, document);
  }

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
