import { COMMAND_PREFIX, SUPPORTED_COMMANDS, type SupportedCommand } from '../config/constants';
import type { ParsedCommand } from '../types/commands.types';
import { sanitizeText, stripCommandPrefix } from '../utils/sanitize';

const COMMAND_SET = new Set<string>(SUPPORTED_COMMANDS);

export class CommandParserService {
  parse(rawMessage: string): ParsedCommand {
    const raw = sanitizeText(rawMessage);
    if (!raw.startsWith(COMMAND_PREFIX)) {
      return {
        name: null,
        raw,
        args: raw,
        isCommand: false,
      };
    }

    const withoutPrefix = stripCommandPrefix(raw);
    const [head, ...rest] = withoutPrefix.split(/\s+/);
    const candidate = (head ?? '').toLowerCase();

    if (!COMMAND_SET.has(candidate)) {
      return {
        name: null,
        raw,
        args: raw,
        isCommand: false,
      };
    }

    return {
      name: candidate as SupportedCommand,
      raw,
      args: rest.join(' ').trim(),
      isCommand: true,
    };
  }
}
