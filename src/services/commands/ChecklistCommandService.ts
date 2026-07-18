import { buildChecklistPrompt } from '../../prompts/checklist.prompt';
import { AiCommandBase } from './AiCommandBase';

export class ChecklistCommandService extends AiCommandBase {
  readonly name = 'checklist';
  protected readonly historyKind = 'checklist';
  protected readonly missingArgsMessage =
    'Informe o escopo. Ex: /checklist release de pagamentos';

  protected buildPrompt(args: string): string {
    return buildChecklistPrompt(args);
  }
}
