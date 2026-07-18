import type { UsageEntity } from '../../entities/Usage';

export interface CreateUsageInput {
  userId?: string | null;
  model: string;
  command?: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  durationMs: number;
}

export interface UsageAggregate {
  totalTokens: number;
  totalCostUsd: number;
  avgDurationMs: number;
  count: number;
}

export interface DailyUsage {
  date: string;
  totalTokens: number;
  totalCostUsd: number;
  requests: number;
}

export interface IUsageRepository {
  create(input: CreateUsageInput): Promise<UsageEntity>;
  aggregate(): Promise<UsageAggregate>;
  daily(days: number): Promise<DailyUsage[]>;
  monthly(months: number): Promise<DailyUsage[]>;
}
