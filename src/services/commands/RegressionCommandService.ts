import type {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../../interfaces/commands/ICommandHandler';
import type { IHistoryRepository } from '../../interfaces/repositories/IHistoryRepository';
import type { IPreferenceRepository } from '../../interfaces/repositories/IPreferenceRepository';
import type { IOpenAIService } from '../../interfaces/services/IOpenAIService';
import { buildRegressionPrompt } from '../../prompts/regression.prompt';
import type { ChecklistItem, RegressionFlowState } from '../../types/commands.types';
import { createId } from '../../utils/id';
import type { ConversationService } from '../ConversationService';

interface RegressionModulesPayload {
  modules: Array<{ name: string; items: string[] }>;
}

export class RegressionCommandService implements ICommandHandler {
  readonly name = 'regressao';

  constructor(
    private readonly openAIService: IOpenAIService,
    private readonly historyRepository: IHistoryRepository,
    private readonly preferenceRepository: IPreferenceRepository,
    private readonly conversationService: ConversationService,
  ) {}

  async handle(context: CommandContext): Promise<CommandResult> {
    const response = await this.openAIService.complete({
      prompt: buildRegressionPrompt(context.args),
      userId: context.userId,
      command: 'regressao',
      temperature: 0.2,
    });

    const parsed = this.parseModules(response.content);
    const items = this.toItems(parsed);
    const state: RegressionFlowState = { flow: 'regressao', items };

    await this.conversationService.setFlow(context.userId, 'regressao', state);
    await this.preferenceRepository.set(
      context.userId,
      'regression_checklist',
      JSON.stringify(state),
    );

    await this.historyRepository.create({
      userId: context.userId,
      kind: 'regressao',
      title: 'Checklist de regressão',
      content: this.formatChecklist(items),
    });

    return {
      reply: [
        this.formatChecklist(items),
        '',
        'Para marcar itens: *feito 1,3* ou *done 2*',
        'Para ver progresso: *status*',
        'Para encerrar: *cancelar*',
      ].join('\n'),
      keepFlow: true,
    };
  }

  async continue(userId: string, state: RegressionFlowState, message: string): Promise<CommandResult> {
    const lower = message.trim().toLowerCase();

    if (lower === 'cancelar' || lower === '/cancelar') {
      await this.conversationService.clearFlow(userId);
      return { reply: 'Checklist de regressão encerrado.' };
    }

    if (lower === 'status') {
      return { reply: this.formatChecklist(state.items), keepFlow: true };
    }

    const match = lower.match(/^(feito|done)\s+([\d,\s]+)$/);
    if (!match) {
      return {
        reply:
          'Comando não reconhecido no fluxo de regressão. Use: feito 1,3 | status | cancelar',
        keepFlow: true,
      };
    }

    const indexes = (match[2] ?? '')
      .split(',')
      .map((part) => Number(part.trim()))
      .filter((num) => Number.isInteger(num) && num > 0);

    const items = state.items.map((item, index) =>
      indexes.includes(index + 1) ? { ...item, done: true } : item,
    );

    const nextState: RegressionFlowState = { flow: 'regressao', items };
    await this.conversationService.setFlow(userId, 'regressao', nextState);
    await this.preferenceRepository.set(userId, 'regression_checklist', JSON.stringify(nextState));

    const pending = items.filter((item) => !item.done).length;
    return {
      reply: `${this.formatChecklist(items)}\n\nPendentes: ${pending}`,
      keepFlow: pending > 0,
    };
  }

  private parseModules(content: string): RegressionModulesPayload {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        modules: [
          {
            name: 'Geral',
            items: content
              .split('\n')
              .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
              .filter(Boolean)
              .slice(0, 15),
          },
        ],
      };
    }

    try {
      return JSON.parse(jsonMatch[0]) as RegressionModulesPayload;
    } catch {
      return {
        modules: [{ name: 'Geral', items: ['Validar fluxo principal', 'Validar regressão crítica'] }],
      };
    }
  }

  private toItems(payload: RegressionModulesPayload): ChecklistItem[] {
    const items: ChecklistItem[] = [];
    for (const module of payload.modules ?? []) {
      for (const label of module.items ?? []) {
        items.push({
          id: createId(),
          module: module.name,
          label,
          done: false,
        });
      }
    }
    return items;
  }

  private formatChecklist(items: ChecklistItem[]): string {
    const byModule = new Map<string, ChecklistItem[]>();
    for (const item of items) {
      const list = byModule.get(item.module) ?? [];
      list.push(item);
      byModule.set(item.module, list);
    }

    const lines: string[] = ['*Checklist de Regressão*'];
    let index = 1;
    for (const [moduleName, moduleItems] of byModule.entries()) {
      lines.push('', `*${moduleName}*`);
      for (const item of moduleItems) {
        lines.push(`${index}. [${item.done ? 'x' : ' '}] ${item.label}`);
        index += 1;
      }
    }
    return lines.join('\n');
  }
}
