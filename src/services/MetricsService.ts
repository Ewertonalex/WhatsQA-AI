import type { UserEntity } from '../entities/User';
import type { LogEntryEntity } from '../entities/LogEntry';
import type { CommandCount } from '../interfaces/repositories/ICommandRepository';
import type { ICommandRepository } from '../interfaces/repositories/ICommandRepository';
import type { DailyUsage } from '../interfaces/repositories/IUsageRepository';
import type { ILogRepository } from '../interfaces/repositories/ILogRepository';
import type { IMessageRepository } from '../interfaces/repositories/IMessageRepository';
import type { IUserRepository } from '../interfaces/repositories/IUserRepository';
import type { IUsageRepository } from '../interfaces/repositories/IUsageRepository';

export interface DashboardMetrics {
  users: number;
  messages: number;
  tokens: number;
  estimatedCostUsd: number;
  avgResponseMs: number;
  requests: number;
  topCommands: CommandCount[];
  latestUsers: UserEntity[];
  errorsLast30d: number;
  recentErrors: LogEntryEntity[];
  dailyUsage: DailyUsage[];
  monthlyUsage: DailyUsage[];
}

export class MetricsService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly usageRepository: IUsageRepository,
    private readonly commandRepository: ICommandRepository,
    private readonly logRepository: ILogRepository,
  ) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const since30d = new Date();
    since30d.setDate(since30d.getDate() - 30);

    const [users, messages, usage, topCommands, latestUsers, errors, daily, monthly] =
      await Promise.all([
        this.userRepository.count(),
        this.messageRepository.count(),
        this.usageRepository.aggregate(),
        this.commandRepository.topCommands(10),
        this.userRepository.findLatest(10),
        this.logRepository.countErrorsSince(since30d),
        this.usageRepository.daily(14),
        this.usageRepository.monthly(6),
      ]);

    const recentErrors = await this.logRepository.findRecent(20);

    return {
      users,
      messages,
      tokens: usage.totalTokens,
      estimatedCostUsd: usage.totalCostUsd,
      avgResponseMs: usage.avgDurationMs,
      requests: usage.count,
      topCommands,
      latestUsers,
      errorsLast30d: errors,
      recentErrors: recentErrors.filter((item) => item.level === 'error').slice(0, 10),
      dailyUsage: daily,
      monthlyUsage: monthly,
    };
  }
}
