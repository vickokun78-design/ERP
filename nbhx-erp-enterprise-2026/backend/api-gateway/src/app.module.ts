/**
 * ==========================================
 * NBHX ERP API Gateway - App Module
 * ==========================================
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { join } from 'path';

// Configuración
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import authConfig from './config/auth.config';
import securityConfig from './config/security.config';

// Módulos
import { HealthModule } from './modules/health/health.module';
import { AuthGatewayModule } from './modules/auth-gateway/auth-gateway.module';
import { ProductionGatewayModule } from './modules/production-gateway/production-gateway.module';
import { InventoryGatewayModule } from './modules/inventory-gateway/inventory-gateway.module';
import { QualityGatewayModule } from './modules/quality-gateway/quality-gateway.module';
import { EngineeringGatewayModule } from './modules/engineering-gateway/engineering-gateway.module';
import { HrGatewayModule } from './modules/hr-gateway/hr-gateway.module';
import { FinanceGatewayModule } from './modules/finance-gateway/finance-gateway.module';
import { BiGatewayModule } from './modules/bi-gateway/bi-gateway.module';
import { AdminGatewayModule } from './modules/admin-gateway/admin-gateway.module';
import { AiGatewayModule } from './modules/ai-gateway/ai-gateway.module';

@Module({
  imports: [
    // ==========================================
    // CONFIGURACIÓN GLOBAL
    // ==========================================
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, authConfig, securityConfig],
      envFilePath: ['.env', '../../.env'],
    }),

    // ==========================================
    // RATE LIMITING
    // ==========================================
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('API_RATE_LIMIT_WINDOW', 900000), // 15 minutos
            limit: config.get<number>('API_RATE_LIMIT', 1000),
          },
        ],
      }),
    }),

    // ==========================================
    // GRAPHQL
    // ==========================================
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: config.get('NODE_ENV') !== 'production',
        introspection: config.get('NODE_ENV') !== 'production',
        subscriptions: {
          'graphql-ws': true,
        },
        context: ({ req, res, connection }) => {
          if (connection) {
            return { req: connection.context, res };
          }
          return { req, res };
        },
        formatError: (error) => {
          return {
            message: error.message,
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            timestamp: new Date().toISOString(),
            path: error.path,
          };
        },
      }),
    }),

    // ==========================================
    // HEALTH CHECKS
    // ==========================================
    TerminusModule,
    HealthModule,

    // ==========================================
    // GATEWAYS DE MICROSERVICIOS
    // ==========================================
    AuthGatewayModule,
    ProductionGatewayModule,
    InventoryGatewayModule,
    QualityGatewayModule,
    EngineeringGatewayModule,
    HrGatewayModule,
    FinanceGatewayModule,
    BiGatewayModule,
    AdminGatewayModule,
    AiGatewayModule,
  ],
})
export class AppModule {}
