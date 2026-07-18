import type { PreferenceEntity } from '../entities/Preference';
import type { IPreferenceRepository } from '../interfaces/repositories/IPreferenceRepository';
import { prisma } from '../database/prismaClient';

export class PreferenceRepository implements IPreferenceRepository {
  async get(userId: string, key: string): Promise<PreferenceEntity | null> {
    return prisma.preference.findUnique({
      where: { userId_key: { userId, key } },
    });
  }

  async set(userId: string, key: string, valueJson: string): Promise<PreferenceEntity> {
    return prisma.preference.upsert({
      where: { userId_key: { userId, key } },
      create: { userId, key, valueJson },
      update: { valueJson },
    });
  }
}
