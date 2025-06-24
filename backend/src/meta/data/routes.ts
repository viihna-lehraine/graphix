// File: backend/src/meta/data/routes.ts

import type { RouteTable } from '../index.js';

export const routes: RouteTable = {
  auth: {
    signup: { method: 'POST', path: '/auth/signup' },
    login: { method: 'POST', path: '/auth/login' },
    me: { method: 'GET', path: '/auth/me' }
  },
  projects: {
    delete: { method: 'DELETE', path: '/projects/delete/:id' },
    getBySlug: { method: 'GET', path: '/projects/:slug' },
    load: { method: 'GET', path: '/projects/load' },
    save: { method: 'POST', path: '/projects/save' }
  }
} as const;
