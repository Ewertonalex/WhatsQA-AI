import type { IHistoryRepository } from '../interfaces/repositories/IHistoryRepository';
import type { IMessageRepository } from '../interfaces/repositories/IMessageRepository';
import type { IOpenAIService } from '../interfaces/services/IOpenAIService';
import type { ContextBuilderService } from './ContextBuilderService';

export class ChatService {
  constructor(
    private readonly openAIService: IOpenAIService,
    private readonly contextBuilder: ContextBuilderService,
    private readonly messageRepository: IMessageRepository,
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async reply(userId: string, message: string): Promise<string> {
    const memoryHint = await this.contextBuilder.buildMemoryHint(userId, message);
    const context = await this.contextBuilder.buildChatContext(userId);

    const prompt = memoryHint
      ? `Contexto de memória recuperado:\n${memoryHint}\n\nPergunta do usuário:\n${message}`
      : message;

    const response = await this.openAIService.complete({
      prompt,
      context,
      userId,
      command: 'chat',
    });

    await this.messageRepository.create({
      userId,
      direction: 'outbound',
      content: response.content,
      command: 'chat',
    });

    if (memoryHint) {
      await this.historyRepository.create({
        userId,
        kind: 'memory',
        title: 'Consulta de memória',
        content: response.content,
      });
    }

    return response.content;
  }
}
