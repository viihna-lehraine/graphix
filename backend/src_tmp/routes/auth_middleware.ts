

import type { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAuth(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return res.status(401).send({ error: 'Invalid or missing token' });
  }
}
