// File: frontend/src/app/types/generics.ts

export type Brand<T, B extends string> = T & { __brand: B };
