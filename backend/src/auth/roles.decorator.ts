import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/schema/user.schema'; 

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);