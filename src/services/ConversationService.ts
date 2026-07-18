import type { ConversationEntity } from '../entities/Conversation';
import type { IConversationRepository } from '../interfaces/repositories/IConversationRepository';
import type { FlowState } from '../types/commands.types';

export class ConversationService {
  constructor(private readonly conversationRepository: IConversationRepository) {}

  async getOrCreateActive(userId: string): Promise<ConversationEntity> {
    const active = await this.conversationRepository.findActiveByUser(userId);
    if (active) {
      return active;
    }

    const initialState: FlowState = { flow: 'none' };
    return this.conversationRepository.create({
      userId,
      flow: 'none',
      stateJson: JSON.stringify(initialState),
    });
  }

  parseState(conversation: ConversationEntity): FlowState {
    try {
      return JSON.parse(conversation.stateJson) as FlowState;
    } catch {
      return { flow: 'none' };
    }
  }

  async setFlow(userId: string, flow: string, state: FlowState): Promise<ConversationEntity> {
    const conversation = await this.getOrCreateActive(userId);
    return this.conversationRepository.updateState(conversation.id, {
      flow,
      stateJson: JSON.stringify(state),
      isActive: true,
    });
  }

  async clearFlow(userId: string): Promise<void> {
    await this.conversationRepository.closeActiveByUser(userId);
  }
}
