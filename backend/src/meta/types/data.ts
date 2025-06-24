// File: backend/src/meta/types/data.ts

import type { RouteTable } from '../index.js';

export interface ConfigurationData {
  jwt_expiration: string;
}

export interface RegexData {
  email: RegExp;
}

export interface Data {
  config: ConfigurationData;
  regex: RegexData;
  routes: RouteTable;
}
