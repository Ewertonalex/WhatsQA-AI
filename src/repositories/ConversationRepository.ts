import type { ConversationEntity } from '../entities/Conversation';
import type {
  CreateConversationInput,
  IConversationRepository,
} from '../interfaces/repositories/IConversationRepository';
import { prisma } from '../database/prismaClient';

export class ConversationRepository implements IConversationRepository {
  async findActiveByUser(userId: string): Promise<ConversationEntity | null> {
    return prisma.conversation.findFirst({
      where: { userId, isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(input: CreateConversationInput): Promise<ConversationEntity> {
    return prisma.conversation.create({
      data: {
        userId: input.userId,
        title: input.title ?? null,
        flow: input.flow ?? 'none',
        stateJson: input.stateJson ?? '{}',
      },
    });
  }

  async updateState(
    id: string,
    data: { flow?: string; stateJson?: string; title?: string | null; isActive?: boolean },
  ): Promise<ConversationEntity> {
    return prisma.conversation.update({
      where: { id },
      data,
    });
  }

  async closeActiveByUser(userId: string): Promise<void> {
    await prisma.conversation.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false, flow: 'none', stateJson: '{}' },
    });
  }
}
