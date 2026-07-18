import type { CommandEntity } from '../../entities/Command';

export interface CreateCommandInput {
  userId: string;
  name: string;
  args?: string | null;
  success?: boolean;
  durationMs?: number;
}

export interface CommandCount {
  name: string;
  count: number;
}

export interface ICommandRepository {
  create(input: CreateCommandInput): Promise<CommandEntity>;
  topCommands(limit: number): Promise<CommandCount[]>;
}
