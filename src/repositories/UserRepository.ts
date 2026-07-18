import type { UserEntity } from '../entities/User';
import type {
  CreateUserInput,
  IUserRepository,
} from '../interfaces/repositories/IUserRepository';
import { prisma } from '../database/prismaClient';

export class UserRepository implements IUserRepository {
  async findByPhone(phone: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { phone } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    return prisma.user.create({
      data: {
        phone: input.phone,
        name: input.name ?? null,
        isAdmin: input.isAdmin ?? false,
      },
    });
  }

  async upsertByPhone(input: CreateUserInput): Promise<UserEntity> {
    return prisma.user.upsert({
      where: { phone: input.phone },
      create: {
        phone: input.phone,
        name: input.name ?? null,
        isAdmin: input.isAdmin ?? false,
      },
      update: {
        name: input.name ?? undefined,
        isAdmin: input.isAdmin ?? undefined,
      },
    });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }

  async findLatest(limit: number): Promise<UserEntity[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
