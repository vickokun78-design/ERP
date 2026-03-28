/**
 * ==========================================
 * Permissions Guard - Control de Permisos Granular
 * ==========================================
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export enum Permission {
  // Producción
  PRODUCTION_READ = 'production:read',
  PRODUCTION_CREATE = 'production:create',
  PRODUCTION_UPDATE = 'production:update',
  PRODUCTION_DELETE = 'production:delete',
  PRODUCTION_EXECUTE = 'production:execute',
  
  // Inventarios
  INVENTORY_READ = 'inventory:read',
  INVENTORY_CREATE = 'inventory:create',
  INVENTORY_UPDATE = 'inventory:update',
  INVENTORY_DELETE = 'inventory:delete',
  
  // Calidad
  QUALITY_READ = 'quality:read',
  QUALITY_CREATE = 'quality:create',
  QUALITY_UPDATE = 'quality:update',
  QUALITY_APPROVE = 'quality:approve',
  
  // Ingeniería
  ENGINEERING_READ = 'engineering:read',
  ENGINEERING_CREATE = 'engineering:create',
  ENGINEERING_UPDATE = 'engineering:update',
  
  // RRHH
  HR_READ = 'hr:read',
  HR_CREATE = 'hr:create',
  HR_UPDATE = 'hr:update',
  HR_DELETE = 'hr:delete',
  
  // Finanzas
  FINANCE_READ = 'finance:read',
  FINANCE_CREATE = 'finance:create',
  FINANCE_APPROVE = 'finance:approve',
  
  // Administración
  ADMIN_READ = 'admin:read',
  ADMIN_WRITE = 'admin:write',
  ADMIN_SYSTEM = 'admin:system',
}

export const PERMISSIONS_KEY = 'permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const hasPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasPermissions) {
      throw new ForbiddenException(
        `Permisos insuficientes. Se requieren: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
