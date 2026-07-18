/**
 * Estimativa heurística (~4 chars/token) quando a API não retorna usage.
 */
export function estimateTokens(text: string): number {
  if (!text) {
    return 0;
  }
  return Math.max(1, Math.ceil(text.length / 4));
}
