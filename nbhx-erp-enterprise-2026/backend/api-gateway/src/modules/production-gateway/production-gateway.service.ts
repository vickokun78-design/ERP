/**
 * ==========================================
 * Production Gateway Service
 * CORE del ERP - Módulo de Producción
 * ==========================================
 */

import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginationParams, PaginatedResponse } from '../../types';

// ==========================================
// DTOs y Tipos
// ==========================================
export interface WorkOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  quantityProduced: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  workCenterId: string;
  workCenterName: string;
  assignedOperators: string[];
  materials: WorkOrderMaterial[];
  operations: WorkOrderOperation[];
  qualityChecks: QualityCheck[];
  scrapQuantity: number;
  reworkQuantity: number;
  oee?: OEEData;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderMaterial {
  id: string;
  materialId: string;
  materialName: string;
  quantityRequired: number;
  quantityConsumed: number;
  unitOfMeasure: string;
  lotNumber?: string;
}

export interface WorkOrderOperation {
  id: string;
  sequence: number;
  name: string;
  description?: string;
  estimatedTime: number; // minutos
  actualTime?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  workCenterId: string;
}

export interface QualityCheck {
  id: string;
  type: 'IN_PROCESS' | 'FINAL' | 'FIRST_PIECE';
  result: 'PASS' | 'FAIL' | 'PENDING';
  inspectorId: string;
  checkedAt: Date;
  notes?: string;
}

export interface OEEData {
  availability: number; // %
  performance: number; // %
  quality: number; // %
  oee: number; // %
  calculatedAt: Date;
}

export interface MRPRun {
  id: string;
  runDate: Date;
  horizonDays: number;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  results: MRPResult[];
  createdBy: string;
}

export interface MRPResult {
  id: string;
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  availableQuantity: number;
  netRequirement: number;
  plannedOrderDate: Date;
  plannedReceiptDate: Date;
  orderType: 'PURCHASE' | 'PRODUCTION' | 'TRANSFER';
}

export interface ProductionSchedule {
  id: string;
  scheduleDate: Date;
  workCenterId: string;
  workCenterName: string;
  shifts: ProductionShift[];
  totalCapacity: number;
  utilizedCapacity: number;
  efficiency: number;
}

export interface ProductionShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  operators: string[];
  plannedOrders: string[];
}

export interface ShopFloorData {
  workCenterId: string;
  workCenterName: string;
  status: 'RUNNING' | 'IDLE' | 'DOWN' | 'SETUP' | 'MAINTENANCE';
  currentOrderId?: string;
  currentProduct?: string;
  operatorId?: string;
  operatorName?: string;
  cycleTime?: number; // segundos
  piecesPerHour?: number;
  totalPieces: number;
  goodPieces: number;
  scrapPieces: number;
  oee: number;
  lastUpdate: Date;
  alarms: ShopFloorAlarm[];
}

export interface ShopFloorAlarm {
  id: string;
  type: 'WARNING' | 'ERROR' | 'INFO';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface CreateWorkOrderDto {
  productId: string;
  quantity: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  plannedStartDate: Date;
  plannedEndDate: Date;
  workCenterId: string;
  notes?: string;
}

export interface UpdateWorkOrderDto {
  status?: WorkOrder['status'];
  quantityProduced?: number;
  actualStartDate?: Date;
  actualEndDate?: Date;
  scrapQuantity?: number;
  reworkQuantity?: number;
}

@Injectable()
export class ProductionGatewayService {
  private readonly logger = new Logger(ProductionGatewayService.name);
  private readonly productionServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productionServiceUrl = this.configService.get<string>('SERVICES.PRODUCTION');
  }

  // ==========================================
  // ÓRDENES DE PRODUCCIÓN
  // ==========================================

  async getWorkOrders(params: PaginationParams & { status?: string }): Promise<PaginatedResponse<WorkOrder>> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/work-orders`, { params })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getWorkOrder(id: string): Promise<WorkOrder> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/work-orders/${id}`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async createWorkOrder(dto: CreateWorkOrderDto): Promise<WorkOrder> {
    this.logger.log(`Creando orden de producción: ${dto.productId}`);
    const response = await firstValueFrom(
      this.httpService.post(`${this.productionServiceUrl}/work-orders`, dto)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async updateWorkOrder(id: string, dto: UpdateWorkOrderDto): Promise<WorkOrder> {
    const response = await firstValueFrom(
      this.httpService.patch(`${this.productionServiceUrl}/work-orders/${id}`, dto)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async deleteWorkOrder(id: string): Promise<void> {
    await firstValueFrom(
      this.httpService.delete(`${this.productionServiceUrl}/work-orders/${id}`)
        .pipe(catchError(this.handleError)),
    );
  }

  // ==========================================
  // MRP (Material Requirements Planning)
  // ==========================================

  async runMRP(horizonDays: number = 30): Promise<MRPRun> {
    this.logger.log(`Ejecutando MRP con horizonte de ${horizonDays} días`);
    const response = await firstValueFrom(
      this.httpService.post(`${this.productionServiceUrl}/mrp/run`, { horizonDays })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getMRPRuns(): Promise<MRPRun[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/mrp/runs`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getMRPResults(runId: string): Promise<MRPResult[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/mrp/runs/${runId}/results`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  // ==========================================
  // SCHEDULING (Programación)
  // ==========================================

  async getProductionSchedule(
    startDate: Date,
    endDate: Date,
    workCenterId?: string,
  ): Promise<ProductionSchedule[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/schedule`, {
        params: { startDate, endDate, workCenterId },
      }).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async optimizeSchedule(): Promise<{ message: string; optimizedOrders: number }> {
    const response = await firstValueFrom(
      this.httpService.post(`${this.productionServiceUrl}/schedule/optimize`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  // ==========================================
  // SHOP FLOOR CONTROL
  // ==========================================

  async getShopFloorStatus(): Promise<ShopFloorData[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/shop-floor/status`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getWorkCenterStatus(workCenterId: string): Promise<ShopFloorData> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/shop-floor/work-centers/${workCenterId}`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async startOperation(workOrderId: string, operationId: string, operatorId: string): Promise<void> {
    await firstValueFrom(
      this.httpService.post(
        `${this.productionServiceUrl}/work-orders/${workOrderId}/operations/${operationId}/start`,
        { operatorId },
      ).pipe(catchError(this.handleError)),
    );
  }

  async completeOperation(
    workOrderId: string,
    operationId: string,
    data: { goodQuantity: number; scrapQuantity: number; notes?: string },
  ): Promise<void> {
    await firstValueFrom(
      this.httpService.post(
        `${this.productionServiceUrl}/work-orders/${workOrderId}/operations/${operationId}/complete`,
        data,
      ).pipe(catchError(this.handleError)),
    );
  }

  // ==========================================
  // OEE (Overall Equipment Effectiveness)
  // ==========================================

  async getOEEReport(
    workCenterId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<OEEData & { trends: any[] }> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/oee/report`, {
        params: { workCenterId, startDate, endDate },
      }).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getRealTimeOEE(workCenterId?: string): Promise<OEEData | OEEData[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/oee/realtime`, {
        params: { workCenterId },
      }).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  // ==========================================
  // TRAZABILIDAD
  // ==========================================

  async getLotTraceability(lotNumber: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/traceability/lots/${lotNumber}`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getSerialTraceability(serialNumber: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.productionServiceUrl}/traceability/serials/${serialNumber}`)
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  // ==========================================
  // SCRAP Y RETRABAJOS
  // ==========================================

  async reportScrap(
    workOrderId: string,
    data: { quantity: number; reason: string; operatorId: string; notes?: string },
  ): Promise<void> {
    await firstValueFrom(
      this.httpService.post(
        `${this.productionServiceUrl}/work-orders/${workOrderId}/scrap`,
        data,
      ).pipe(catchError(this.handleError)),
    );
  }

  async reportRework(
    workOrderId: string,
    data: { quantity: number; reason: string; operatorId: string; notes?: string },
  ): Promise<void> {
    await firstValueFrom(
      this.httpService.post(
        `${this.productionServiceUrl}/work-orders/${workOrderId}/rework`,
        data,
      ).pipe(catchError(this.handleError)),
    );
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  private handleError(error: any) {
    throw new HttpException(
      error.response?.data || 'Error en servicio de producción',
      error.response?.status || 500,
    );
  }
}
