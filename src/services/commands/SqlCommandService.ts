import { buildSqlPrompt } from '../../prompts/sql.prompt';
import { AiCommandBase } from './AiCommandBase';

export class SqlCommandService extends AiCommandBase {
  readonly name = 'sql';
  protected readonly historyKind = 'sql';
  protected readonly missingArgsMessage =
    'Descreva a necessidade. Ex: /sql usuários ativos nos últimos 30 dias';

  protected buildPrompt(args: string): string {
    return buildSqlPrompt(args);
  }
}
