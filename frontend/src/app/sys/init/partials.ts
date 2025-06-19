// File: fronend/src/app/sys/init/partials.ts

import type {
  Core,
  Data,
  EnvVars,
  Helpers,
  Services,
  Utilities
} from '../../types/index.js';
import { RenderingEngine } from '@engine/RenderingEngine.js';

export async function initializeData(): Promise<Required<Data>> {
  console.log(`Initializing Data object...`);

  try {
    const { data } = await import('@data/index.js');

    return data;
  } catch (error) {
    console.error(`Failed to initialize Data:`, error);
    throw new Error(`Data initialization failed`);
  }
}

export async function initializeEnvVars(): Promise<Required<EnvVars>> {
  console.log(`Initializing EnvVars object...`);

  try {
    const { env } = await import('../../config/env_vars.js');

    return env;
  } catch (error) {
    console.error(`Failed to initialize EnvVars:`, error);
    throw new Error(`EnvVars initialization failed`);
  }
}

export async function initializeHelpers(): Promise<Required<Helpers>> {
  console.log(`Initializing Helpers object...`);

  try {
    const { helpersFactory } = await import('@sys/factories/helpers.js');

    const helpers: Helpers = await helpersFactory();

    return helpers;
  } catch (error) {
    console.error(`Failed to initialize Helpers:`, error);
    throw new Error(`Helpers initialization failed`);
  }
}

export async function initializeRenderingEngine(
  ctx: CanvasRenderingContext2D,
  core: Core
): Promise<RenderingEngine> {
  return core.services.errors.handleAsync(async () => {
    console.debug('Initializing the Rendering Engine...');
    const renderingEngine = RenderingEngine.getInstance(ctx, core);

    return renderingEngine;
  }, `Rendering Engine initialization failed.`);
}

export async function initializeServices(
  data: Data,
  env: EnvVars,
  helpers: Helpers,
  utils: Utilities
): Promise<Required<Services>> {
  console.log(`Initializing Services object...`);

  try {
    const { serviceFactory } = await import('@sys/factories/services.js');

    const services: Services = await serviceFactory(data, env, helpers, utils);

    return services;
  } catch (error) {
    console.error(`Failed to initialize Services:`, error);
    throw new Error(`Services initialization failed`);
  }
}

export async function initializeUtilities(): Promise<Required<Utilities>> {
  console.log(`Initializing Utilities object...`);

  try {
    const { utilitiesFactory } = await import('@sys/factories/utilities.js');
    const utilities: Utilities = await utilitiesFactory();

    return utilities;
  } catch (error) {
    throw new Error(`Utilities initialization failed.`);
  }
}
