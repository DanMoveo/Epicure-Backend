import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  roles: Role[];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Extract the token from the Authorization header
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader
      ? authorizationHeader.split(' ')[1]
      : undefined;

    // Log the token
    console.log('Token:', token);

    // Verify and decode the token with the CustomJwtPayload type
    try {
      const decodedToken = jwt.verify(token, 'dandan') as CustomJwtPayload;
      const userRoles = decodedToken.roles;

      // Log the user's roles
      console.log('Decoded Token:', decodedToken);
      console.log('User Roles:', userRoles);

      // Compare the user's roles with the required roles
      return requiredRoles.some((requiredRole) =>
        userRoles.includes(requiredRole),
      );
    } catch (error) {
      // Token verification failed or token is invalid
      console.error('Token verification failed:', error);
      return false;
    }
  }
}
