import type { UsageEntity } from '../entities/Usage';
import type {
  CreateUsageInput,
  DailyUsage,
  IUsageRepository,
  UsageAggregate,
} from '../interfaces/repositories/IUsageRepository';
import { prisma } from '../database/prismaClient';

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export class UsageRepository implements IUsageRepository {
  async create(input: CreateUsageInput): Promise<UsageEntity> {
    return prisma.usage.create({
      data: {
        userId: input.userId ?? null,
        model: input.model,
        command: input.command ?? null,
        promptTokens: input.promptTokens,
        completionTokens: input.completionTokens,
        totalTokens: input.totalTokens,
        estimatedCostUsd: input.estimatedCostUsd,
        durationMs: input.durationMs,
      },
    });
  }

  async aggregate(): Promise<UsageAggregate> {
    const result = await prisma.usage.aggregate({
      _sum: {
        totalTokens: true,
        estimatedCostUsd: true,
      },
      _avg: {
        durationMs: true,
      },
      _count: {
        _all: true,
      },
    });

    return {
      totalTokens: result._sum.totalTokens ?? 0,
      totalCostUsd: Number((result._sum.estimatedCostUsd ?? 0).toFixed(6)),
      avgDurationMs: Math.round(result._avg.durationMs ?? 0),
      count: result._count._all,
    };
  }

  async daily(days: number): Promise<DailyUsage[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await prisma.usage.findMany({
      where: { createdAt: { gte: since } },
      select: {
        createdAt: true,
        totalTokens: true,
        estimatedCostUsd: true,
      },
    });

    const map = new Map<string, DailyUsage>();

    for (const row of rows) {
      const key = toDateKey(row.createdAt);
      const current = map.get(key) ?? {
        date: key,
        totalTokens: 0,
        totalCostUsd: 0,
        requests: 0,
      };
      current.totalTokens += row.totalTokens;
      current.totalCostUsd += row.estimatedCostUsd;
      current.requests += 1;
      map.set(key, current);
    }

    return Array.from(map.values())
      .map((item) => ({
        ...item,
        totalCostUsd: Number(item.totalCostUsd.toFixed(6)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async monthly(months: number): Promise<DailyUsage[]> {
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const rows = await prisma.usage.findMany({
      where: { createdAt: { gte: since } },
      select: {
        createdAt: true,
        totalTokens: true,
        estimatedCostUsd: true,
      },
    });

    const map = new Map<string, DailyUsage>();

    for (const row of rows) {
      const key = toMonthKey(row.createdAt);
      const current = map.get(key) ?? {
        date: key,
        totalTokens: 0,
        totalCostUsd: 0,
        requests: 0,
      };
      current.totalTokens += row.totalTokens;
      current.totalCostUsd += row.estimatedCostUsd;
      current.requests += 1;
      map.set(key, current);
    }

    return Array.from(map.values())
      .map((item) => ({
        ...item,
        totalCostUsd: Number(item.totalCostUsd.toFixed(6)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
