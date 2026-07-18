import type {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../../interfaces/commands/ICommandHandler';
import type { IHistoryRepository } from '../../interfaces/repositories/IHistoryRepository';
import type { IOpenAIService } from '../../interfaces/services/IOpenAIService';
import { buildBugPrompt } from '../../prompts/bug.prompt';
import type { BugFlowState } from '../../types/commands.types';
import type { ConversationService } from '../ConversationService';

const QUESTIONS: Record<BugFlowState['step'], string> = {
  title: 'Vamos abrir um bug. Qual o *título*?',
  description: 'Descreva o problema (descrição).',
  steps: 'Quais são os *passos para reproduzir*?',
  expected: 'Qual era o *resultado esperado*?',
  actual: 'Qual foi o *resultado obtido*?',
  environment: 'Qual o *ambiente* (OS, browser, versão, etc.)?',
  done: 'Bug gerado.',
};

export class BugCommandService implements ICommandHandler {
  readonly name = 'bug';

  constructor(
    private readonly openAIService: IOpenAIService,
    private readonly historyRepository: IHistoryRepository,
    private readonly conversationService: ConversationService,
  ) {}

  async handle(context: CommandContext): Promise<CommandResult> {
    const conversation = await this.conversationService.getOrCreateActive(context.userId);
    const state = this.conversationService.parseState(conversation);

    if (state.flow !== 'bug') {
      const initial: BugFlowState = {
        flow: 'bug',
        step: 'title',
        data: {},
      };
      await this.conversationService.setFlow(context.userId, 'bug', initial);
      return { reply: QUESTIONS.title, keepFlow: true };
    }

    return this.continue(context.userId, state, context.args || context.rawMessage);
  }

  async continue(userId: string, state: BugFlowState, answer: string): Promise<CommandResult> {
    const value = answer.trim();
    if (!value) {
      return { reply: QUESTIONS[state.step], keepFlow: true };
    }

    const data = { ...state.data };

    switch (state.step) {
      case 'title':
        data.title = value;
        await this.conversationService.setFlow(userId, 'bug', {
          flow: 'bug',
          step: 'description',
          data,
        });
        return { reply: QUESTIONS.description, keepFlow: true };
      case 'description':
        data.description = value;
        await this.conversationService.setFlow(userId, 'bug', {
          flow: 'bug',
          step: 'steps',
          data,
        });
        return { reply: QUESTIONS.steps, keepFlow: true };
      case 'steps':
        data.steps = value;
        await this.conversationService.setFlow(userId, 'bug', {
          flow: 'bug',
          step: 'expected',
          data,
        });
        return { reply: QUESTIONS.expected, keepFlow: true };
      case 'expected':
        data.expected = value;
        await this.conversationService.setFlow(userId, 'bug', {
          flow: 'bug',
          step: 'actual',
          data,
        });
        return { reply: QUESTIONS.actual, keepFlow: true };
      case 'actual':
        data.actual = value;
        await this.conversationService.setFlow(userId, 'bug', {
          flow: 'bug',
          step: 'environment',
          data,
        });
        return { reply: QUESTIONS.environment, keepFlow: true };
      case 'environment': {
        data.environment = value;
        const response = await this.openAIService.complete({
          prompt: buildBugPrompt({
            title: data.title ?? '',
            description: data.description ?? '',
            steps: data.steps ?? '',
            expected: data.expected ?? '',
            actual: data.actual ?? '',
            environment: data.environment ?? '',
          }),
          userId,
          command: 'bug',
        });

        await this.historyRepository.create({
          userId,
          kind: 'bug',
          title: data.title ?? 'Bug',
          content: response.content,
        });

        await this.conversationService.clearFlow(userId);

        return {
          reply: response.content,
          historyKind: 'bug',
          historyTitle: data.title,
        };
      }
      default:
        await this.conversationService.clearFlow(userId);
        return { reply: 'Fluxo de bug encerrado. Envie /bug para iniciar novamente.' };
    }
  }
}
