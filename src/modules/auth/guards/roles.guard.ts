import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolesMetadataKey } from '../constants/roles-metadata-key.constant';
import { JwtUser } from '../models/jwt-user.interface';
import { UserRole } from '@/modules/users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles: UserRole[] | undefined = this.reflector.getAllAndOverride<UserRole[]>(rolesMetadataKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request: { readonly user?: JwtUser } = context.switchToHttp().getRequest();
    const user: JwtUser | undefined = request.user;
    if (!user) {
      return false;
    }
    return requiredRoles.includes(user.role);
  }
}
