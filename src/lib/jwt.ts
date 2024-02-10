import { verify } from 'jsonwebtoken';

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
    throw new Error('JWT_SECRET must be defined');
  }
    const data = verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS512'],
    });
  return data as JwtPayload;
};
