// File: frontend/src/app/meta/errors/classes.ts

import { system_error_classes } from './system.js';
import { user_facing_error_classes } from './user_facing.js';

export const error_classes = {
  ...system_error_classes,
  ...user_facing_error_classes
} as const;
