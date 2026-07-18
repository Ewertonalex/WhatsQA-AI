import { getEnv } from '../config/env';
import type { UserEntity } from '../entities/User';
import type { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { normalizePhone } from '../utils/sanitize';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async resolveFromPhone(phone: string, name?: string | null): Promise<UserEntity> {
    const normalized = normalizePhone(phone);
    const adminNumber = normalizePhone(getEnv().ADMIN_NUMBER);
    const isAdmin = normalized === adminNumber;

    return this.userRepository.upsertByPhone({
      phone: normalized,
      name: name ?? null,
      isAdmin,
    });
  }
}
