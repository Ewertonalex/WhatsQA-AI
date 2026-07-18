import { getEnv } from '../config/env';
import type { UserEntity } from '../entities/User';
import type { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { normalizePhone } from '../utils/sanitize';

export interface ResolvedUser {
  user: UserEntity;
  isNew: boolean;
}

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async resolveFromPhone(phone: string, name?: string | null): Promise<ResolvedUser> {
    const normalized = normalizePhone(phone);
    const adminNumber = normalizePhone(getEnv().ADMIN_NUMBER);
    const isAdmin = normalized === adminNumber;
    const existing = await this.userRepository.findByPhone(normalized);

    const user = await this.userRepository.upsertByPhone({
      phone: normalized,
      name: name ?? null,
      isAdmin,
    });

    return {
      user,
      isNew: existing === null,
    };
  }
}
