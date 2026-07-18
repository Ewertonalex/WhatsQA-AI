import { buildPlanPrompt } from '../../prompts/plan.prompt';
import { AiCommandBase } from './AiCommandBase';

export class PlanCommandService extends AiCommandBase {
  readonly name = 'plano';
  protected readonly historyKind = 'plano';
  protected readonly missingArgsMessage =
    'Descreva o projeto/feature. Ex: /plano app de delivery sprint 12';

  protected buildPrompt(args: string): string {
    return buildPlanPrompt(args);
  }
}
