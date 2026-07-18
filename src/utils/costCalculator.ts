import { MODEL_COST_PER_1M_TOKENS } from '../config/openai';

export function calculateCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const rates = MODEL_COST_PER_1M_TOKENS[model] ?? MODEL_COST_PER_1M_TOKENS.default;
  const inputCost = (promptTokens / 1_000_000) * rates.input;
  const outputCost = (completionTokens / 1_000_000) * rates.output;
  return Number((inputCost + outputCost).toFixed(6));
}
