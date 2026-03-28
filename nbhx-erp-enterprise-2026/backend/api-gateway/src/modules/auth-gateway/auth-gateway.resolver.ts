/**
 * ==========================================
 * Auth Gateway Resolver (GraphQL)
 * ==========================================
 */

import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGatewayService } from './auth-gateway.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

// GraphQL Types
import { Field, ObjectType, InputType, ID } from '@nestjs/graphql';

@ObjectType()
class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => [String])
  permissions: string[];
}

@ObjectType()
class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expiresIn: number;

  @Field(() => UserType)
  user: UserType;
}

@InputType()
class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  mfaCode?: string;
}

@InputType()
class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  department?: string;
}

@Resolver()
export class AuthGatewayResolver {
  constructor(private readonly authService: AuthGatewayService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async logout(
    @CurrentUser('id') userId: string,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(userId, token);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserType)
  async me(@CurrentUser() user: any) {
    return user;
  }
}
