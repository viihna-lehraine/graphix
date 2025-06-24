// File: backend/src/core/utils/slug.ts

import slugifyBase from 'slugify';
import { nanoid } from 'nanoid';

export function generateProjectSlug(name: string): string {
  const base = slugifyBase(name, { lower: true, strict: true });
  const id = nanoid(6);
  return `${base}-${id}`;
}
