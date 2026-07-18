import type { HistoryEntity } from '../entities/History';
import type {
  CreateHistoryInput,
  IHistoryRepository,
} from '../interfaces/repositories/IHistoryRepository';
import { prisma } from '../database/prismaClient';

export class HistoryRepository implements IHistoryRepository {
  async create(input: CreateHistoryInput): Promise<HistoryEntity> {
    return prisma.history.create({
      data: {
        userId: input.userId,
        kind: input.kind,
        title: input.title,
        content: input.content,
        metadataJson: input.metadataJson ?? '{}',
      },
    });
  }

  async findLatestByUser(
    userId: string,
    kind?: string,
    limit = 5,
  ): Promise<HistoryEntity[]> {
    return prisma.history.findMany({
      where: {
        userId,
        ...(kind ? { kind } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async searchByUser(userId: string, query: string, limit = 5): Promise<HistoryEntity[]> {
    return prisma.history.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { kind: { contains: query } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
