/**
 * ==========================================
 * Production Gateway Controller (REST API)
 * CORE del ERP - Producción
 * ==========================================
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductionGatewayService, CreateWorkOrderDto, UpdateWorkOrderDto } from './production-gateway.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../../common/guards/roles.guard';
import { PermissionsGuard, Permission } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('production')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ProductionGatewayController {
  constructor(private readonly productionService: ProductionGatewayService) {}

  // ==========================================
  // ÓRDENES DE PRODUCCIÓN
  // ==========================================

  @Get('work-orders')
  @Permissions(Permission.PRODUCTION_READ)
  async getWorkOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.productionService.getWorkOrders({ page, limit, status });
  }

  @Get('work-orders/:id')
  @Permissions(Permission.PRODUCTION_READ)
  async getWorkOrder(@Param('id') id: string) {
    return this.productionService.getWorkOrder(id);
  }

  @Post('work-orders')
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERVISOR)
  @Permissions(Permission.PRODUCTION_CREATE)
  async createWorkOrder(
    @Body() dto: CreateWorkOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.productionService.createWorkOrder(dto);
  }

  @Patch('work-orders/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPERVISOR)
  @Permissions(Permission.PRODUCTION_UPDATE)
  async updateWorkOrder(
    @Param('id') id: string,
    @Body() dto: UpdateWorkOrderDto,
  ) {
    return this.productionService.updateWorkOrder(id, dto);
  }

  @Delete('work-orders/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @Permissions(Permission.PRODUCTION_DELETE)
  async deleteWorkOrder(@Param('id') id: string) {
    await this.productionService.deleteWorkOrder(id);
    return { message: 'Orden de producción eliminada' };
  }

  // ==========================================
  // MRP
  // ==========================================

  @Post('mrp/run')
  @Roles(Role.ADMIN, Role.MANAGER)
  @Permissions(Permission.PRODUCTION_EXECUTE)
  async runMRP(@Query('horizonDays', new DefaultValuePipe(30), ParseIntPipe) horizonDays: number) {
    return this.productionService.runMRP(horizonDays);
  }

  @Get('mrp/runs')
  @Permissions(Permission.PRODUCTION_READ)
  async getMRPRuns() {
    return this.productionService.getMRPRuns();
  }

  @Get('mrp/runs/:runId/results')
  @Permissions(Permission.PRODUCTION_READ)
  async getMRPResults(@Param('runId') runId: string) {
    return this.productionService.getMRPResults(runId);
  }

  // ==========================================
  // SCHEDULING
  // ==========================================

  @Get('schedule')
  @Permissions(Permission.PRODUCTION_READ)
  async getProductionSchedule(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('workCenterId') workCenterId?: string,
  ) {
    return this.productionService.getProductionSchedule(
      new Date(startDate),
      new Date(endDate),
      workCenterId,
    );
  }

  @Post('schedule/optimize')
  @Roles(Role.ADMIN, Role.MANAGER)
  @Permissions(Permission.PRODUCTION_EXECUTE)
  async optimizeSchedule() {
    return this.productionService.optimizeSchedule();
  }

  // ==========================================
  // SHOP FLOOR CONTROL
  // ==========================================

  @Get('shop-floor/status')
  @Permissions(Permission.PRODUCTION_READ)
  async getShopFloorStatus() {
    return this.productionService.getShopFloorStatus();
  }

  @Get('shop-floor/work-centers/:id')
  @Permissions(Permission.PRODUCTION_READ)
  async getWorkCenterStatus(@Param('id') id: string) {
    return this.productionService.getWorkCenterStatus(id);
  }

  @Post('work-orders/:workOrderId/operations/:operationId/start')
  @Roles(Role.OPERATOR, Role.SUPERVISOR, Role.MANAGER)
  @Permissions(Permission.PRODUCTION_EXECUTE)
  async startOperation(
    @Param('workOrderId') workOrderId: string,
    @Param('operationId') operationId: string,
    @CurrentUser('id') operatorId: string,
  ) {
    await this.productionService.startOperation(workOrderId, operationId, operatorId);
    return { message: 'Operación iniciada' };
  }

  @Post('work-orders/:workOrderId/operations/:operationId/complete')
  @Roles(Role.OPERATOR, Role.SUPERVISOR, Role.MANAGER)
  @Permissions(Permission.PRODUCTION_EXECUTE)
  async completeOperation(
    @Param('workOrderId') workOrderId: string,
    @Param('operationId') operationId: string,
    @Body() data: { goodQuantity: number; scrapQuantity: number; notes?: string },
  ) {
    await this.productionService.completeOperation(workOrderId, operationId, data);
    return { message: 'Operación completada' };
  }

  // ==========================================
  // OEE
  // ==========================================

  @Get('oee/report')
  @Permissions(Permission.PRODUCTION_READ)
  async getOEEReport(
    @Query('workCenterId') workCenterId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.productionService.getOEEReport(workCenterId, new Date(startDate), new Date(endDate));
  }

  @Get('oee/realtime')
  @Permissions(Permission.PRODUCTION_READ)
  async getRealTimeOEE(@Query('workCenterId') workCenterId?: string) {
    return this.productionService.getRealTimeOEE(workCenterId);
  }

  // ==========================================
  // TRAZABILIDAD
  // ==========================================

  @Get('traceability/lots/:lotNumber')
  @Permissions(Permission.PRODUCTION_READ)
  async getLotTraceability(@Param('lotNumber') lotNumber: string) {
    return this.productionService.getLotTraceability(lotNumber);
  }

  @Get('traceability/serials/:serialNumber')
  @Permissions(Permission.PRODUCTION_READ)
  async getSerialTraceability(@Param('serialNumber') serialNumber: string) {
    return this.productionService.getSerialTraceability(serialNumber);
  }

  // ==========================================
  // SCRAP Y RETRABAJOS
  // ==========================================

  @Post('work-orders/:id/scrap')
  @Roles(Role.OPERATOR, Role.SUPERVISOR, Role.MANAGER)
  @Permissions(Permission.PRODUCTION_UPDATE)
  async reportScrap(
    @Param('id') workOrderId: string,
    @Body() data: { quantity: number; reason: string; notes?: string },
    @CurrentUser('id') operatorId: string,
  ) {
    await this.productionService.reportScrap(workOrderId, { ...data, operatorId });
    return { message: 'Scrap reportado' };
  }

  @Post('work-orders/:id/rework')
  @Roles(Role.OPERATOR, Role.SUPERVISOR, Role.MANAGER)
  @Permissions(Permission.PRODUCTION_UPDATE)
  async reportRework(
    @Param('id') workOrderId: string,
    @Body() data: { quantity: number; reason: string; notes?: string },
    @CurrentUser('id') operatorId: string,
  ) {
    await this.productionService.reportRework(workOrderId, { ...data, operatorId });
    return { message: 'Retrabajo reportado' };
  }
}
