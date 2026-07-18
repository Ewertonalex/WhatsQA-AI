import type { ConversationEntity } from '../../entities/Conversation';

export interface CreateConversationInput {
  userId: string;
  title?: string | null;
  flow?: string;
  stateJson?: string;
}

export interface IConversationRepository {
  findActiveByUser(userId: string): Promise<ConversationEntity | null>;
  create(input: CreateConversationInput): Promise<ConversationEntity>;
  updateState(
    id: string,
    data: { flow?: string; stateJson?: string; title?: string | null; isActive?: boolean },
  ): Promise<ConversationEntity>;
  closeActiveByUser(userId: string): Promise<void>;
}
