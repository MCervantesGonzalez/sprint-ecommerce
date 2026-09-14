import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Limpia el / del final y espacios
  const clean = (url: string) => url.trim().replace(/\/+$/, '');
  const raw = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
  const allowedOrigins = raw.split(',').map(clean).filter(Boolean);

  console.log('CORS allowed origins:', allowedOrigins);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Ecommerce API')
      .setDescription('API para tienda de productos personalizados')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app as any, config);
    SwaggerModule.setup('api/docs', app as any, document);
  }

  // CORS FIX para Vercel
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman, curl
      if (allowedOrigins.length === 0) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Si en algún momento pones https://*.vercel.app
      const wildcardOk = allowedOrigins.some((p) => {
        if (!p.includes('*')) return false;
        const regex = new RegExp('^' + p.replace(/\*/g, '.*') + '$');
        return regex.test(origin);
      });
      if (wildcardOk) return callback(null, true);

      console.warn(`CORS bloqueado: ${origin} no está en`, allowedOrigins);
      return callback(null, true); // déjalo en true para probar, luego cámbialo a false
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  });

  const port = process.env.PORT || 10000;
  await app.listen(port);
  console.log(`API running on ${port}`);
}

bootstrap();
