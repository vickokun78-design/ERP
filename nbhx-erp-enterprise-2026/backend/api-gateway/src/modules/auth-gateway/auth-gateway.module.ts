import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGatewayController } from './auth-gateway.controller';
import { AuthGatewayService } from './auth-gateway.service';
import { AuthGatewayResolver } from './auth-gateway.resolver';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('AUTH.JWT.SECRET'),
        signOptions: {
          expiresIn: config.get('AUTH.JWT.EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthGatewayController],
  providers: [AuthGatewayService, AuthGatewayResolver],
  exports: [AuthGatewayService],
})
export class AuthGatewayModule {}
