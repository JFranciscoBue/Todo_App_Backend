import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class authGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization'].split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Acceso Dengado');
    }

    try {
      const user = this.jwt.verify(token, { secret: process.env.JWT_SECRET });

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);

      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Acceso Denegado');
    }
  }
}
