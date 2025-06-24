

import type { SignupPayload } from '../meta/index.js';
import type { FastifyInstance } from 'fastify';
import { AuthService } from '../meta/index.js';
import { requireAuth } from './auth_middleware.js';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const auth = new AuthService(fastify.knex);

  fastify.post('/login', async (req, res) => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).send({ error: 'Missing email or password' });
    }

    const valid = await auth.verifyUser({ email, password });
    if (!valid) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    const user = await fastify.knex('users').where({ email }).first();
    const token = fastify.jwt.sign({ userId: user.id });

    return { success: true, token };
  });

  fastify.get('/me', { preHandler: requireAuth }, async (req, _res) => {
    const user = await fastify
      .knex('users')
      .where({ id: req.user.userId })
      .select('email', 'display_name')
      .first();

    return { user };
  });

  fastify.post('/signup', async (req, res) => {
    const { email, password, displayName } = req.body as SignupPayload;

    if (!email || !password) {
      return res.status(400).send({ error: 'Missing email or password' });
    }

    const result = await auth.createUser({ email, password, displayName });

    if (!result.success) {
      return res.status(400).send({ error: result.error });
    }

    return { success: true, userId: result.userId };
  });
}
