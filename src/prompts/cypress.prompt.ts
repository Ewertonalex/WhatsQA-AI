export function buildCypressPrompt(input: string): string {
  return [
    'Gere automação Cypress completa usando boas práticas:',
    'Page Objects, Fixtures, Custom Commands, Intercepts e organização de pastas.',
    'Entregue código TypeScript pronto para uso e explicações breves.',
    '',
    input,
  ].join('\n');
}
