import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyJwt } from 'src/lib/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {

    const request = context.switchToHttp().getRequest();
    // It doesn't work on production, so we need backup method :(
    const token = request.cookies['auth_token'] ?? request.body.auth_token;

    if (!token) {
      console.log('No token found in request cookies');
      console.log("request cookies: ", request.cookies);
      return false;
    }

    try {
      const payload = verifyJwt(token);
      request.user = payload.user;
      return true;
    } catch (error) {
      console.error('Token validation failed', error);
      return false; // Token validation failed
    }
  }
}
