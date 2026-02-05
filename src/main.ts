import 'reflect-metadata';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  const requestBodyLimit: string = process.env.REQUEST_BODY_LIMIT ?? '2mb';
  app.use(json({ limit: requestBodyLimit }));
  app.use(urlencoded({ limit: requestBodyLimit, extended: true }));

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({ origin: true, credentials: true });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GashaDrift Car Rental API')
    .setDescription('REST API documentation for GashaDrift Car Rental.')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, { ignoreGlobalPrefix: true });
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port: number = Number(process.env.PORT ?? 3000);
  const logger = new Logger('Bootstrap');

  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  logger.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
};

void bootstrap();
