/**
 * ==========================================
 * Tipos Compartidos del API Gateway
 * ==========================================
 */

// ==========================================
// Paginación
// ==========================================
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ==========================================
// Filtros
// ==========================================
export interface FilterParams {
  [key: string]: string | number | boolean | Date | string[] | undefined;
}

// ==========================================
// Respuestas API
// ==========================================
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

// ==========================================
// Usuario
// ==========================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  department?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Auditoría
// ==========================================
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// ==========================================
// WebSocket Events
// ==========================================
export interface WebSocketEvent<T = any> {
  event: string;
  data: T;
  timestamp: Date;
}

// ==========================================
// Estados
// ==========================================
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ARCHIVED';
export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
