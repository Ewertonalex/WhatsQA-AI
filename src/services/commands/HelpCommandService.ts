import { APP_NAME, APP_TAGLINE, SUPPORTED_COMMANDS } from '../../config/constants';
import type {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../../interfaces/commands/ICommandHandler';

export class HelpCommandService implements ICommandHandler {
  readonly name = 'help';

  handle(_context: CommandContext): Promise<CommandResult> {
    const commands = SUPPORTED_COMMANDS.map((cmd) => `/${cmd}`).join('\n');

    return Promise.resolve({
      reply: [
        `*${APP_NAME}*`,
        APP_TAGLINE,
        '',
        'Comandos disponíveis:',
        commands,
        '',
        'Dicas:',
        '- /bug inicia um fluxo guiado de abertura de bug',
        '- /regressao gera checklist e permite marcar itens com: feito 1,3',
        '- Pergunte sobre histórico: "o último bug que gerei"',
      ].join('\n'),
    });
  }
}
