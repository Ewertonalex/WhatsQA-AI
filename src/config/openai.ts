import { getEnv } from './env';

export interface OpenAIRuntimeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export function getOpenAIConfig(): OpenAIRuntimeConfig {
  const env = getEnv();
  return {
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    maxTokens: env.MAX_TOKENS,
    temperature: env.TEMPERATURE,
  };
}

/** Custo aproximado USD por 1M tokens (estimativa; ajustar conforme modelo). */
export const MODEL_COST_PER_1M_TOKENS: Record<
  string,
  { input: number; output: number }
> = {
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-4o': { input: 2.5, output: 10 },
  'gpt-4.1-mini': { input: 0.4, output: 1.6 },
  default: { input: 0.15, output: 0.6 },
};
