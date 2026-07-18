import type { UserEntity } from '../../entities/User';

export interface CreateUserInput {
  phone: string;
  name?: string | null;
  isAdmin?: boolean;
}

export interface IUserRepository {
  findByPhone(phone: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(input: CreateUserInput): Promise<UserEntity>;
  upsertByPhone(input: CreateUserInput): Promise<UserEntity>;
  count(): Promise<number>;
  findLatest(limit: number): Promise<UserEntity[]>;
}
