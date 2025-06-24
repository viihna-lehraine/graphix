// File: backend/src/services/AuthService.ts

import type {
  AuthServiceContract,
  SignupPayload,
  SignupResult
} from '../meta/index.js';
import type { Knex } from 'knex';
import bcrypt from 'bcrypt';

export class AuthService implements AuthServiceContract {
  #knex: Knex;

  constructor(knex: Knex) {
    this.#knex = knex;
  }

  async createUser(payload: SignupPayload): Promise<SignupResult> {
    try {
      const { email, password, displayName } = payload;
      if (!email) {
        return { success: false, error: 'Missing email' };
      }
      if (!password) {
        return { success: false, error: 'Missing password' };
      }
      const existing = await this.#knex('users')
        .where({ email: payload.email })
        .first();

      if (existing) {
        return { success: false, error: 'User already exists' };
      }

      const hash = await bcrypt.hash(password, 12);
      const [user] = await this.#knex('users')
        .insert({ email, password_hash: hash, display_name: displayName })
        .returning('id');

      return {
        success: true,
        userId: typeof user === 'object' ? user.id : user
      };
    } catch (err) {
      return { success: false, error: 'Database error' };
    }
  }

  async verifyUser(payload: SignupPayload): Promise<boolean> {
    const { email, password } = payload;
    if (!email || !password) return false;

    const user = await this.#knex('users').where({ email }).first();

    if (!user) return false;

    return bcrypt.compare(password, user.password_hash);
  }
}
