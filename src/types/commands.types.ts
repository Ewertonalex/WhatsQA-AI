import type { SupportedCommand } from '../config/constants';

export type CommandName = SupportedCommand;

export interface ParsedCommand {
  name: CommandName | null;
  raw: string;
  args: string;
  isCommand: boolean;
}

export type ConversationFlow =
  | 'none'
  | 'bug'
  | 'regressao'
  | 'checklist'
  | 'teste'
  | 'bdd'
  | 'api'
  | 'sql'
  | 'cypress'
  | 'postman'
  | 'plano'
  | 'riscos'
  | 'story'
  | 'swagger'
  | 'explicar';

export interface BugFlowState {
  flow: 'bug';
  step:
    | 'title'
    | 'description'
    | 'steps'
    | 'expected'
    | 'actual'
    | 'environment'
    | 'done';
  data: {
    title?: string;
    description?: string;
    steps?: string;
    expected?: string;
    actual?: string;
    environment?: string;
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  module: string;
}

export interface RegressionFlowState {
  flow: 'regressao';
  items: ChecklistItem[];
}

export type FlowState = BugFlowState | RegressionFlowState | { flow: 'none' };
