/**
 * ==========================================
 * NBHX ERP ENTERPRISE 2026
 * API Gateway - Punto de Entrada Principal
 * ==========================================
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // ==========================================
  // SEGURIDAD
  // ==========================================
  
  // Helmet - Headers de seguridad
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Compresión GZIP
  app.use(compression());

  // Cookie Parser
  app.use(cookieParser());

  // ==========================================
  // CORS
  // ==========================================
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // ==========================================
  // VALIDACIÓN Y TRANSFORMACIÓN
  // ==========================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ==========================================
  // VERSIONAMIENTO DE API
  // ==========================================
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // ==========================================
  // INTERCEPTORES GLOBALES
  // ==========================================
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor(),
  );

  // ==========================================
  // FILTROS GLOBALES
  // ==========================================
  app.useGlobalFilters(new AllExceptionsFilter());

  // ==========================================
  // INICIAR SERVIDOR
  // ==========================================
  await app.listen(port, '0.0.0.0');

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║           🏭 NBHX ERP ENTERPRISE 2026 🏭                       ║
║                                                                ║
║              API Gateway Iniciado                              ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║  🌐 URL:        http://localhost:${port}                        ║
║  📊 GraphQL:    http://localhost:${port}/graphql                ║
║  💊 Health:     http://localhost:${port}/health                 ║
║  🌍 Entorno:    ${nodeEnv.toUpperCase().padEnd(20)}                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
