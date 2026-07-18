import { buildExplainPrompt } from '../../prompts/explain.prompt';
import { AiCommandBase } from './AiCommandBase';

export class ExplainCommandService extends AiCommandBase {
  readonly name = 'explicar';
  protected readonly historyKind = 'explicar';
  protected readonly missingArgsMessage =
    'Envie o que deseja explicar. Ex: /explicar teste de contrato';

  protected buildPrompt(args: string): string {
    return buildExplainPrompt(args);
  }
}
