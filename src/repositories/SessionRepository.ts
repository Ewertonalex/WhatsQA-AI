import type { SessionEntity } from '../entities/Session';
import type {
  ISessionRepository,
  UpsertSessionInput,
} from '../interfaces/repositories/ISessionRepository';
import { prisma } from '../database/prismaClient';

export class SessionRepository implements ISessionRepository {
  async findByName(sessionName: string): Promise<SessionEntity | null> {
    return prisma.session.findFirst({
      where: { sessionName },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async upsertByName(input: UpsertSessionInput): Promise<SessionEntity> {
    const existing = await this.findByName(input.sessionName);

    if (!existing) {
      return prisma.session.create({
        data: {
          sessionName: input.sessionName,
          status: input.status,
          userId: input.userId ?? null,
          lastSeenAt: input.lastSeenAt ?? null,
          metadataJson: input.metadataJson ?? '{}',
        },
      });
    }

    return prisma.session.update({
      where: { id: existing.id },
      data: {
        status: input.status,
        userId: input.userId ?? existing.userId,
        lastSeenAt: input.lastSeenAt ?? new Date(),
        metadataJson: input.metadataJson ?? existing.metadataJson,
      },
    });
  }
}
