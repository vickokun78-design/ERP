/**
 * ==========================================
 * Health Check Controller
 * ==========================================
 */

import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Check base de datos
      () => this.db.pingCheck('database'),
      
      // Check memoria
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      
      // Check disco
      () => this.disk.checkStorage('disk', { thresholdPercent: 0.9, path: '/' }),
      
      // Check microservicios
      () => this.http.pingCheck('auth-service', 
        `${this.configService.get('SERVICES.AUTH')}/health`),
      () => this.http.pingCheck('production-service', 
        `${this.configService.get('SERVICES.PRODUCTION')}/health`),
      () => this.http.pingCheck('inventory-service', 
        `${this.configService.get('SERVICES.INVENTORY')}/health`),
      () => this.http.pingCheck('quality-service', 
        `${this.configService.get('SERVICES.QUALITY')}/health`),
    ]);
  }

  @Get('liveness')
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nbhx-api-gateway',
    };
  }

  @Get('readiness')
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
