

import type { Middleware, Routes } from '../meta/index.js';
import { authRoutes } from './auth.js';
import { requireAuth } from './auth_middleware.js';
import { projectRoutes } from './projects.js';

export const routes: Routes = {
  auth: authRoutes,
  projects: projectRoutes
} as const;

export const middleware: Middleware = {
  requireAuth
} as const;
