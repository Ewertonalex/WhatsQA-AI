export interface LogEntryEntity {
  id: string;
  userId: string | null;
  level: string;
  event: string;
  prompt: string | null;
  response: string | null;
  model: string | null;
  tokens: number | null;
  durationMs: number | null;
  errorMessage: string | null;
  metadataJson: string;
  createdAt: Date;
}
