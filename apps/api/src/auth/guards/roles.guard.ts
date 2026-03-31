import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lee los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // primero busca en el método
      context.getClass(), // luego en la clase
    ]);

    // Si el endpoint no tiene @Roles(), deja pasar
    if (!requiredRoles) return true;

    // Extrae req.user que inyectó la JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // Verifica que el rol del usuario esté en los roles requeridos
    return requiredRoles.includes(user.role);
  }
}
