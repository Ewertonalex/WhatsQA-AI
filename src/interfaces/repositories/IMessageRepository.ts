import type { MessageDirection, MessageEntity } from '../../entities/Message';

export interface CreateMessageInput {
  userId: string;
  conversationId?: string | null;
  direction: MessageDirection;
  content: string;
  command?: string | null;
  metadataJson?: string;
}

export interface IMessageRepository {
  create(input: CreateMessageInput): Promise<MessageEntity>;
  findRecentByUser(userId: string, limit: number): Promise<MessageEntity[]>;
  count(): Promise<number>;
  countSince(date: Date): Promise<number>;
}
