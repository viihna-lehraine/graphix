// File: backend/src/services/JWTService.ts

import type { JWTServiceContract, TokenPayload } from '../meta/index.js';
import { FastifyInstance } from 'fastify';

export class JWTService implements JWTServiceContract {
  #fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.#fastify = fastify;
  }

  sign(payload: TokenPayload): string {
    return this.#fastify.jwt.sign(payload);
  }

  verify(token: string): TokenPayload | null {
    try {
      return this.#fastify.jwt.verify<TokenPayload>(token);
    } catch {
      return null;
    }
  }
}
