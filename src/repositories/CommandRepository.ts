import type { CommandEntity } from '../entities/Command';
import type {
  CommandCount,
  CreateCommandInput,
  ICommandRepository,
} from '../interfaces/repositories/ICommandRepository';
import { prisma } from '../database/prismaClient';

export class CommandRepository implements ICommandRepository {
  async create(input: CreateCommandInput): Promise<CommandEntity> {
    return prisma.command.create({
      data: {
        userId: input.userId,
        name: input.name,
        args: input.args ?? null,
        success: input.success ?? true,
        durationMs: input.durationMs ?? 0,
      },
    });
  }

  async topCommands(limit: number): Promise<CommandCount[]> {
    const grouped = await prisma.command.groupBy({
      by: ['name'],
      _count: { name: true },
      orderBy: { _count: { name: 'desc' } },
      take: limit,
    });

    return grouped.map((item) => ({
      name: item.name,
      count: item._count.name,
    }));
  }
}
