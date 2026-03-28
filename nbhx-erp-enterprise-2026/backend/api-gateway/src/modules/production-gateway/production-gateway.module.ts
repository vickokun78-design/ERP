import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductionGatewayController } from './production-gateway.controller';
import { ProductionGatewayService } from './production-gateway.service';
import { ProductionGatewayResolver } from './production-gateway.resolver';

@Module({
  imports: [HttpModule],
  controllers: [ProductionGatewayController],
  providers: [ProductionGatewayService, ProductionGatewayResolver],
  exports: [ProductionGatewayService],
})
export class ProductionGatewayModule {}
