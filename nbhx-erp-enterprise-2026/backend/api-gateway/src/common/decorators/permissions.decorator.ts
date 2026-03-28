/**
 * ==========================================
 * Permissions Decorator
 * ==========================================
 */

import { SetMetadata } from '@nestjs/common';
import { Permission } from '../guards/permissions.guard';

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
