import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
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
  await app.listen(port);
};

void bootstrap();
