import { verify } from 'jsonwebtoken';
import { HttpStatus, HttpException } from '@nestjs/common';

export type JwtUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type JwtPayload = {
  sub?: string;
  id_token?: string;
  access_token?: string;
  expires_at?: number;
  user: JwtUser;
};

export const verifyJwt = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new HttpException(
      'JWT_SECRET must be defined',
      HttpStatus.BAD_REQUEST,
    );
  }
  const data = verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS512'],
  });
  return data as JwtPayload;
};
