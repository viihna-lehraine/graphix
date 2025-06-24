// File: backend/src/meta/declarations/jwt.d.ts

import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string };
    user: { userId: string };
  }
}
