import { buildRiskPrompt } from '../../prompts/risk.prompt';
import { AiCommandBase } from './AiCommandBase';

export class RiskCommandService extends AiCommandBase {
  readonly name = 'riscos';
  protected readonly historyKind = 'riscos';
  protected readonly missingArgsMessage =
    'Envie a User Story. Ex: /riscos Como cliente quero...';

  protected buildPrompt(args: string): string {
    return buildRiskPrompt(args);
  }
}
