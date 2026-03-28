/**
 * ==========================================
 * Logging Interceptor - Auditoría de Requests
 * ==========================================
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const requestId = uuidv4();
    const startTime = Date.now();
    
    // Agregar request ID al request
    request.requestId = requestId;
    
    // Información del request
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const userId = request.user?.id || 'anonymous';
    
    console.log(JSON.stringify({
      type: 'REQUEST',
      requestId,
      timestamp: new Date().toISOString(),
      method,
      url,
      ip,
      userAgent,
      userId,
      body: this.sanitizeBody(request.body),
    }));

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;
        
        console.log(JSON.stringify({
          type: 'RESPONSE',
          requestId,
          timestamp: new Date().toISOString(),
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          userId,
        }));
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sensitiveFields = ['password', 'token', 'secret', 'creditCard', 'ssn'];
    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }
    
    return sanitized;
  }
}
