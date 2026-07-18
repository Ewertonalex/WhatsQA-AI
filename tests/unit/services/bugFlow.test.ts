import type { IHistoryRepository } from '../../../src/interfaces/repositories/IHistoryRepository';
import type { IOpenAIService } from '../../../src/interfaces/services/IOpenAIService';
import type { IConversationRepository } from '../../../src/interfaces/repositories/IConversationRepository';
import { BugCommandService } from '../../../src/services/commands/BugCommandService';
import { ConversationService } from '../../../src/services/ConversationService';
import type { ConversationEntity } from '../../../src/entities/Conversation';

describe('BugCommandService flow', () => {
  it('inicia fluxo pedindo título', async () => {
    let stateJson = JSON.stringify({ flow: 'none' });
    const conversation: ConversationEntity = {
      id: 'c1',
      userId: 'u1',
      title: null,
      flow: 'none',
      stateJson,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const conversationRepository: IConversationRepository = {
      findActiveByUser: () => Promise.resolve({ ...conversation, stateJson }),
      create: () => Promise.resolve(conversation),
      updateState: (_id, data) => {
        stateJson = data.stateJson ?? stateJson;
        conversation.flow = data.flow ?? conversation.flow;
        conversation.stateJson = stateJson;
        return Promise.resolve({ ...conversation });
      },
      closeActiveByUser: () => {
        stateJson = JSON.stringify({ flow: 'none' });
        return Promise.resolve();
      },
    };

    const openAIService: IOpenAIService = {
      complete: () =>
        Promise.resolve({
          content: 'bug gerado',
          model: 'gpt-4o-mini',
          usage: {
            promptTokens: 1,
            completionTokens: 1,
            totalTokens: 2,
            estimatedCostUsd: 0,
          },
          durationMs: 10,
        }),
    };

    const historyRepository: IHistoryRepository = {
      create: (input) =>
        Promise.resolve({
          id: 'h1',
          userId: input.userId,
          kind: input.kind,
          title: input.title,
          content: input.content,
          metadataJson: '{}',
          createdAt: new Date(),
        }),
      findLatestByUser: () => Promise.resolve([]),
      searchByUser: () => Promise.resolve([]),
    };

    const service = new BugCommandService(
      openAIService,
      historyRepository,
      new ConversationService(conversationRepository),
    );

    const start = await service.handle({
      userId: 'u1',
      phone: '5511',
      args: '',
      rawMessage: '/bug',
    });

    expect(start.reply.toLowerCase()).toContain('título');
    expect(start.keepFlow).toBe(true);

    const step2 = await service.handle({
      userId: 'u1',
      phone: '5511',
      args: 'Erro no login',
      rawMessage: 'Erro no login',
    });

    expect(step2.reply.toLowerCase()).toContain('descri');
  });
});
