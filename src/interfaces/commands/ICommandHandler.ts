export interface CommandContext {
  userId: string;
  phone: string;
  args: string;
  rawMessage: string;
}

export interface CommandResult {
  reply: string;
  historyKind?: string;
  historyTitle?: string;
  keepFlow?: boolean;
}

export interface ICommandHandler {
  readonly name: string;
  handle(context: CommandContext): Promise<CommandResult>;
}
