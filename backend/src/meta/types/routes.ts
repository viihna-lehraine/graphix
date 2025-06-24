// File: backend/src/meta/types/routes.ts

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';
export type RouteEndpoint = { method: HttpMethod; path: string };

export type RouteKey = keyof RouteMap;
export type RouteMap = typeof import('../data/routes.js').routes;

export interface RouteTable {
  auth: {
    login: RouteEndpoint;
    me: RouteEndpoint;
    signup: RouteEndpoint;
  };
  projects: {
    delete: RouteEndpoint;
    getBySlug: RouteEndpoint;
    load: RouteEndpoint;
    save: RouteEndpoint;
  };
}
