import type { HistoryEntity } from '../../entities/History';

export interface CreateHistoryInput {
  userId: string;
  kind: string;
  title: string;
  content: string;
  metadataJson?: string;
}

export interface IHistoryRepository {
  create(input: CreateHistoryInput): Promise<HistoryEntity>;
  findLatestByUser(userId: string, kind?: string, limit?: number): Promise<HistoryEntity[]>;
  searchByUser(userId: string, query: string, limit?: number): Promise<HistoryEntity[]>;
}
