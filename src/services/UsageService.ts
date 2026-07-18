import type {
  DailyUsage,
  IUsageRepository,
  UsageAggregate,
} from '../interfaces/repositories/IUsageRepository';

export class UsageService {
  constructor(private readonly usageRepository: IUsageRepository) {}

  async getSummary(): Promise<UsageAggregate> {
    return this.usageRepository.aggregate();
  }

  async getDaily(days = 14): Promise<DailyUsage[]> {
    return this.usageRepository.daily(days);
  }

  async getMonthly(months = 6): Promise<DailyUsage[]> {
    return this.usageRepository.monthly(months);
  }
}
