import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from 'src/lib/jwt';

export const Identify = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user satisfies JwtUser;
  },
);
