import type { SessionEntity } from '../../entities/Session';

export interface UpsertSessionInput {
  sessionName: string;
  status: string;
  userId?: string | null;
  lastSeenAt?: Date | null;
  metadataJson?: string;
}

export interface ISessionRepository {
  upsertByName(input: UpsertSessionInput): Promise<SessionEntity>;
  findByName(sessionName: string): Promise<SessionEntity | null>;
}
