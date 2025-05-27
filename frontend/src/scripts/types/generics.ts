// File: frontend/src/scripts/types/generics.ts

export type Brand<T, B extends string> = T & { __brand: B };
