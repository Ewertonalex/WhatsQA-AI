import type { LogEntryEntity } from '../../entities/LogEntry';

export interface CreateLogInput {
  userId?: string | null;
  level: string;
  event: string;
  prompt?: string | null;
  response?: string | null;
  model?: string | null;
  tokens?: number | null;
  durationMs?: number | null;
  errorMessage?: string | null;
  metadataJson?: string;
}

export interface ILogRepository {
  create(input: CreateLogInput): Promise<LogEntryEntity>;
  findRecent(limit: number): Promise<LogEntryEntity[]>;
  countErrorsSince(date: Date): Promise<number>;
}
