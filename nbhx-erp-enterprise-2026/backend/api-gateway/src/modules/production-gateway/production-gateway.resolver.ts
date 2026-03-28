/**
 * ==========================================
 * Production Gateway Resolver (GraphQL)
 * ==========================================
 */

import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductionGatewayService } from './production-gateway.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard, Permission } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Field, ObjectType, InputType, Int, registerEnumType } from '@nestjs/graphql';

// Enums
enum WorkOrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

registerEnumType(WorkOrderStatus, { name: 'WorkOrderStatus' });
registerEnumType(Priority, { name: 'Priority' });

// GraphQL Types
@ObjectType()
class WorkOrderType {
  @Field(() => ID)
  id: string;

  @Field()
  orderNumber: string;

  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  quantityProduced: number;

  @Field(() => WorkOrderStatus)
  status: WorkOrderStatus;

  @Field(() => Priority)
  priority: Priority;

  @Field()
  plannedStartDate: Date;

  @Field()
  plannedEndDate: Date;

  @Field({ nullable: true })
  actualStartDate?: Date;

  @Field({ nullable: true })
  actualEndDate?: Date;

  @Field()
  workCenterId: string;

  @Field()
  workCenterName: string;

  @Field(() => Int)
  scrapQuantity: number;

  @Field(() => Int)
  reworkQuantity: number;

  @Field(() => OEEDataType, { nullable: true })
  oee?: OEEDataType;
}

@ObjectType()
class OEEDataType {
  @Field(() => Float)
  availability: number;

  @Field(() => Float)
  performance: number;

  @Field(() => Float)
  quality: number;

  @Field(() => Float)
  oee: number;

  @Field()
  calculatedAt: Date;
}

@ObjectType()
class ShopFloorDataType {
  @Field()
  workCenterId: string;

  @Field()
  workCenterName: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  currentOrderId?: string;

  @Field({ nullable: true })
  currentProduct?: string;

  @Field({ nullable: true })
  operatorName?: string;

  @Field(() => Float, { nullable: true })
  cycleTime?: number;

  @Field(() => Int)
  totalPieces: number;

  @Field(() => Int)
  goodPieces: number;

  @Field(() => Int)
  scrapPieces: number;

  @Field(() => Float)
  oee: number;

  @Field()
  lastUpdate: Date;
}

@ObjectType()
class PaginatedWorkOrders {
  @Field(() => [WorkOrderType])
  data: WorkOrderType[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}

@ObjectType()
class PaginationMeta {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}

@InputType()
class CreateWorkOrderInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Priority)
  priority: Priority;

  @Field()
  plannedStartDate: Date;

  @Field()
  plannedEndDate: Date;

  @Field()
  workCenterId: string;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
class UpdateWorkOrderInput {
  @Field(() => WorkOrderStatus, { nullable: true })
  status?: WorkOrderStatus;

  @Field(() => Int, { nullable: true })
  quantityProduced?: number;

  @Field({ nullable: true })
  actualStartDate?: Date;

  @Field({ nullable: true })
  actualEndDate?: Date;

  @Field(() => Int, { nullable: true })
  scrapQuantity?: number;

  @Field(() => Int, { nullable: true })
  reworkQuantity?: number;
}

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ProductionGatewayResolver {
  constructor(private readonly productionService: ProductionGatewayService) {}

  @Query(() => PaginatedWorkOrders)
  @Permissions(Permission.PRODUCTION_READ)
  async workOrders(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('status', { nullable: true }) status?: string,
  ) {
    return this.productionService.getWorkOrders({ page, limit, status });
  }

  @Query(() => WorkOrderType)
  @Permissions(Permission.PRODUCTION_READ)
  async workOrder(@Args('id', { type: () => ID }) id: string) {
    return this.productionService.getWorkOrder(id);
  }

  @Mutation(() => WorkOrderType)
  @Permissions(Permission.PRODUCTION_CREATE)
  async createWorkOrder(@Args('input') input: CreateWorkOrderInput) {
    return this.productionService.createWorkOrder(input);
  }

  @Mutation(() => WorkOrderType)
  @Permissions(Permission.PRODUCTION_UPDATE)
  async updateWorkOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateWorkOrderInput,
  ) {
    return this.productionService.updateWorkOrder(id, input);
  }

  @Mutation(() => Boolean)
  @Permissions(Permission.PRODUCTION_DELETE)
  async deleteWorkOrder(@Args('id', { type: () => ID }) id: string) {
    await this.productionService.deleteWorkOrder(id);
    return true;
  }

  @Query(() => [ShopFloorDataType])
  @Permissions(Permission.PRODUCTION_READ)
  async shopFloorStatus() {
    return this.productionService.getShopFloorStatus();
  }

  @Query(() => ShopFloorDataType)
  @Permissions(Permission.PRODUCTION_READ)
  async workCenterStatus(@Args('workCenterId') workCenterId: string) {
    return this.productionService.getWorkCenterStatus(workCenterId);
  }

  @Query(() => OEEDataType)
  @Permissions(Permission.PRODUCTION_READ)
  async oeeReport(
    @Args('workCenterId') workCenterId: string,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ) {
    return this.productionService.getOEEReport(workCenterId, startDate, endDate);
  }

  @Query(() => [OEEDataType])
  @Permissions(Permission.PRODUCTION_READ)
  async realTimeOEE(@Args('workCenterId', { nullable: true }) workCenterId?: string) {
    const result = await this.productionService.getRealTimeOEE(workCenterId);
    return Array.isArray(result) ? result : [result];
  }

  @Mutation(() => Boolean)
  @Permissions(Permission.PRODUCTION_EXECUTE)
  async startOperation(
    @Args('workOrderId') workOrderId: string,
    @Args('operationId') operationId: string,
    @Args('operatorId') operatorId: string,
  ) {
    await this.productionService.startOperation(workOrderId, operationId, operatorId);
    return true;
  }

  @Mutation(() => Boolean)
  @Permissions(Permission.PRODUCTION_EXECUTE)
  async completeOperation(
    @Args('workOrderId') workOrderId: string,
    @Args('operationId') operationId: string,
    @Args('goodQuantity', { type: () => Int }) goodQuantity: number,
    @Args('scrapQuantity', { type: () => Int }) scrapQuantity: number,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    await this.productionService.completeOperation(workOrderId, operationId, {
      goodQuantity,
      scrapQuantity,
      notes,
    });
    return true;
  }
}
