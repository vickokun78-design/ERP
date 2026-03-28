/**
 * ==========================================
 * Auth Gateway Service
 * ==========================================
 */

import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginDto {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
  };
}

@Injectable()
export class AuthGatewayService {
  private readonly logger = new Logger(AuthGatewayService.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.authServiceUrl = this.configService.get<string>('SERVICES.AUTH');
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    this.logger.log(`Login attempt: ${dto.email}`);
    
    try {
      const response = await firstValueFrom(
        this.httpService.post<TokenResponse>(
          `${this.authServiceUrl}/auth/login`,
          dto,
        ).pipe(
          catchError((error) => {
            throw new HttpException(
              error.response?.data || 'Error de autenticación',
              error.response?.status || 500,
            );
          }),
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  async register(dto: RegisterDto): Promise<TokenResponse> {
    this.logger.log(`Register attempt: ${dto.email}`);
    
    try {
      const response = await firstValueFrom(
        this.httpService.post<TokenResponse>(
          `${this.authServiceUrl}/auth/register`,
          dto,
        ).pipe(
          catchError((error) => {
            throw new HttpException(
              error.response?.data || 'Error de registro',
              error.response?.status || 500,
            );
          }),
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Register failed: ${error.message}`);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<TokenResponse>(
          `${this.authServiceUrl}/auth/refresh`,
          { refreshToken },
        ).pipe(
          catchError((error) => {
            throw new HttpException(
              error.response?.data || 'Error al refrescar token',
              error.response?.status || 500,
            );
          }),
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw error;
    }
  }

  async logout(userId: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/logout`,
          { userId, token },
        ),
      );
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/validate`,
          { token },
        ).pipe(
          catchError((error) => {
            throw new HttpException(
              error.response?.data || 'Token inválido',
              error.response?.status || 401,
            );
          }),
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw error;
    }
  }

  async setupMFA(userId: string): Promise<{ secret: string; qrCode: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/mfa/setup`,
          { userId },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`MFA setup failed: ${error.message}`);
      throw error;
    }
  }

  async verifyMFA(userId: string, code: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/mfa/verify`,
          { userId, code },
        ),
      );

      return response.data.verified;
    } catch (error) {
      this.logger.error(`MFA verification failed: ${error.message}`);
      return false;
    }
  }
}
