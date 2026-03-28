/**
 * ==========================================
 * Response Transform Interceptor
 * Estandariza todas las respuestas del API
 * ==========================================
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
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

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId || 'unknown';
    
    return next.handle().pipe(
      map((data) => {
        // Si la respuesta ya tiene el formato estándar, retornarla
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            timestamp: new Date().toISOString(),
            requestId,
          };
        }

        // Extraer metadata de paginación si existe
        const meta = data?.meta;
        const responseData = data?.data || data;

        return {
          success: true,
          data: responseData,
          meta,
          timestamp: new Date().toISOString(),
          requestId,
        };
      }),
    );
  }
}
