import type { MessageDirection, MessageEntity } from '../entities/Message';
import type {
  CreateMessageInput,
  IMessageRepository,
} from '../interfaces/repositories/IMessageRepository';
import { prisma } from '../database/prismaClient';

function toMessageEntity(row: {
  id: string;
  userId: string;
  conversationId: string | null;
  direction: string;
  content: string;
  command: string | null;
  metadataJson: string;
  createdAt: Date;
}): MessageEntity {
  return {
    ...row,
    direction: row.direction as MessageDirection,
  };
}

export class MessageRepository implements IMessageRepository {
  async create(input: CreateMessageInput): Promise<MessageEntity> {
    const row = await prisma.message.create({
      data: {
        userId: input.userId,
        conversationId: input.conversationId ?? null,
        direction: input.direction,
        content: input.content,
        command: input.command ?? null,
        metadataJson: input.metadataJson ?? '{}',
      },
    });
    return toMessageEntity(row);
  }

  async findRecentByUser(userId: string, limit: number): Promise<MessageEntity[]> {
    const rows = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map(toMessageEntity);
  }

  async count(): Promise<number> {
    return prisma.message.count();
  }

  async countSince(date: Date): Promise<number> {
    return prisma.message.count({
      where: { createdAt: { gte: date } },
    });
  }
}
