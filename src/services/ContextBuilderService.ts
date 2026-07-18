import type { IHistoryRepository } from '../interfaces/repositories/IHistoryRepository';
import type { IMessageRepository } from '../interfaces/repositories/IMessageRepository';
import type { ChatMessage } from '../types/openai.types';

export class ContextBuilderService {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async buildChatContext(userId: string, limit = 12): Promise<ChatMessage[]> {
    const recent = await this.messageRepository.findRecentByUser(userId, limit);
    return recent
      .reverse()
      .map((message): ChatMessage => ({
        role: message.direction === 'inbound' ? 'user' : 'assistant',
        content: message.content,
      }))
      .filter((message) => message.content.trim().length > 0);
  }

  async buildMemoryHint(userId: string, rawMessage: string): Promise<string | null> {
    const lower = rawMessage.toLowerCase();
    const memoryTriggers = [
      'o que conversamos',
      'ontem',
      'último bug',
      'ultimo bug',
      'última user story',
      'ultima user story',
      'histórico',
      'historico',
    ];

    if (!memoryTriggers.some((trigger) => lower.includes(trigger))) {
      return null;
    }

    let kind: string | undefined;
    if (lower.includes('bug')) {
      kind = 'bug';
    } else if (lower.includes('story') || lower.includes('user story')) {
      kind = 'story';
    }

    const items = await this.historyRepository.findLatestByUser(userId, kind, 5);
    if (items.length === 0) {
      return 'Não encontrei histórico relevante salvo para este usuário.';
    }

    return items
      .map(
        (item, index) =>
          `${index + 1}. [${item.kind}] ${item.title} (${item.createdAt.toISOString()})\n${item.content.slice(0, 500)}`,
      )
      .join('\n\n');
  }
}
