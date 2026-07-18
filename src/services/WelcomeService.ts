import { APP_NAME, APP_TAGLINE } from '../config/constants';

function normalizeGreetingText(message: string): string {
  return message
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[!?.,]+$/g, '')
    .trim();
}

const GREETINGS = new Set([
  'oi',
  'ola',
  'oie',
  'oii',
  'hey',
  'hello',
  'hi',
  'bom dia',
  'boa tarde',
  'boa noite',
  'e ai',
  'eai',
  'salve',
  'start',
  'menu',
  'inicio',
]);

export class WelcomeService {
  isGreeting(message: string): boolean {
    const normalized = normalizeGreetingText(message);
    if (!normalized) {
      return false;
    }

    if (normalized.startsWith('/')) {
      const cmd = normalized.slice(1);
      return cmd === 'start' || cmd === 'menu' || cmd === 'inicio';
    }

    if (GREETINGS.has(normalized)) {
      return true;
    }

    // "oi tudo bem", "ola pessoal"
    const firstWord = normalized.split(/\s+/)[0] ?? '';
    return firstWord === 'oi' || firstWord === 'ola' || firstWord === 'oie';
  }

  buildWelcome(userName?: string | null): string {
    const greetingName = userName?.trim() ? `, ${userName.trim()}` : '';

    return [
      `Olá${greetingName}!`,
      `Eu sou o *${APP_NAME}* — ${APP_TAGLINE}.`,
      '',
      'Sou um assistente de IA especializado em *Engenharia de Qualidade de Software (QA)*.',
      'Posso te ajudar no dia a dia com bugs, testes, BDD, API, SQL, automação e muito mais.',
      '',
      '*O que posso fazer:*',
      '1. `/bug` — Abrir bug de forma profissional (fluxo guiado)',
      '2. `/teste` — Gerar casos de teste a partir de User Story',
      '3. `/bdd` — Gerar Feature/Scenarios em Gherkin',
      '4. `/api` — Testes de API (Postman)',
      '5. `/sql` — Consultas SQL com explicação',
      '6. `/cypress` — Automação Cypress',
      '7. `/regressao` — Checklist de regressão',
      '8. `/plano` — Plano de testes',
      '9. `/riscos` — Análise de riscos da story',
      '10. `/help` — Ver todos os comandos',
      '',
      'Você também pode conversar normalmente, por exemplo:',
      '_"O último bug que gerei"_ ou _"me explica teste de contrato"_.',
      '',
      '*O que você deseja fazer agora?*',
      'Digite um comando (ex: `/bug`) ou me diga seu objetivo em uma frase.',
    ].join('\n');
  }
}
