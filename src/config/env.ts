import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';
import type { AppEnv } from '../types/env.types';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  BOT_NAME: z.string().min(1).default('WhatsQA AI'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY é obrigatória'),
  OPENAI_MODEL: z.string().min(1).default('gpt-4o-mini'),
  MAX_TOKENS: z.coerce.number().int().positive().default(2048),
  TEMPERATURE: z.coerce.number().min(0).max(2).default(0.3),
  DATABASE_URL: z.string().min(1),
  SESSION_NAME: z.string().min(1).default('whatsqa-ai'),
  ADMIN_NUMBER: z.string().min(8),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DASHBOARD_TOKEN: z.string().min(8).optional(),
  ENABLE_WHATSAPP: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
});

export type Env = AppEnv & {
  DASHBOARD_TOKEN?: string;
  ENABLE_WHATSAPP: boolean;
};

let cachedEnv: Env | null = null;

export function loadEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Variáveis de ambiente inválidas: ${details}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getEnv(): Env {
  return loadEnv();
}

export function resetEnvCache(): void {
  cachedEnv = null;
}
