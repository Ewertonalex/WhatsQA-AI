import type { LogEntryEntity } from '../entities/LogEntry';
import type {
  CreateLogInput,
  ILogRepository,
} from '../interfaces/repositories/ILogRepository';
import { prisma } from '../database/prismaClient';

export class LogRepository implements ILogRepository {
  async create(input: CreateLogInput): Promise<LogEntryEntity> {
    return prisma.log.create({
      data: {
        userId: input.userId ?? null,
        level: input.level,
        event: input.event,
        prompt: input.prompt ?? null,
        response: input.response ?? null,
        model: input.model ?? null,
        tokens: input.tokens ?? null,
        durationMs: input.durationMs ?? null,
        errorMessage: input.errorMessage ?? null,
        metadataJson: input.metadataJson ?? '{}',
      },
    });
  }

  async findRecent(limit: number): Promise<LogEntryEntity[]> {
    return prisma.log.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async countErrorsSince(date: Date): Promise<number> {
    return prisma.log.count({
      where: {
        level: 'error',
        createdAt: { gte: date },
      },
    });
  }
}
