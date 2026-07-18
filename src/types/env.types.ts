/**
 * Shape tipado das variáveis de ambiente do WhatsQA AI.
 */
export interface AppEnv {
  BOT_NAME: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  MAX_TOKENS: number;
  TEMPERATURE: number;
  DATABASE_URL: string;
  SESSION_NAME: string;
  ADMIN_NUMBER: string;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
  PORT: number;
  NODE_ENV: 'development' | 'test' | 'production';
}
