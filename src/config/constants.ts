/**
 * Constantes de domínio do WhatsQA AI.
 * Valores sensíveis e configuráveis ficam no .env (módulo M2).
 */
export const APP_NAME = 'WhatsQA AI';

export const APP_TAGLINE = 'SUPORTE TECH PARA QA';

/** Assets de marca servidos pelo Express (pasta public/). */
export const BRAND_ASSETS = {
  logo: '/assets/brand/logo.png',
  banner: '/assets/brand/banner.png',
} as const;

/** Paleta alinhada à identidade visual (logo/banner). */
export const BRAND_COLORS = {
  whatsappGreen: '#25D366',
  forestGreen: '#0B5F3A',
  aiCyan: '#22D3EE',
  ink: '#0A0A0A',
  surface: '#F4F6F8',
} as const;

export const COMMAND_PREFIX = '/';

export const SUPPORTED_COMMANDS = [
  'help',
  'bug',
  'teste',
  'bdd',
  'api',
  'sql',
  'cypress',
  'postman',
  'regressao',
  'checklist',
  'plano',
  'riscos',
  'story',
  'swagger',
  'explicar',
] as const;

export type SupportedCommand = (typeof SUPPORTED_COMMANDS)[number];
