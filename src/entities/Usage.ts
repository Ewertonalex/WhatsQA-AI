export interface UsageEntity {
  id: string;
  userId: string | null;
  model: string;
  command: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  durationMs: number;
  createdAt: Date;
}
