// File: backend/src/meta/typs/contracts.ts

import type {
  Project,
  SignupPayload,
  SignupResult,
  TokenPayload
} from './index.js';

export interface AuthServiceContract {
  createUser: (payload: SignupPayload) => Promise<SignupResult>;
  verifyUser: (payload: SignupPayload) => Promise<boolean>;
}

export interface JWTServiceContract {
  sign: (payload: TokenPayload) => string;
  verify: (token: string) => TokenPayload | null;
}

export interface ProjectServiceContract {
  loadProjects: (userId: string) => Promise<Project[]>;
  saveProject(
    userId: string,
    name: string,
    data: unknown,
    tags?: string[]
  ): Promise<{ success: boolean }>;
}
