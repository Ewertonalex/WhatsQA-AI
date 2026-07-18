export function buildRegressionPrompt(input: string): string {
  return [
    'Crie um checklist de regressão separado por módulos.',
    'Retorne APENAS JSON válido no formato:',
    '{"modules":[{"name":"Modulo","items":["item 1","item 2"]}]}',
    'Sem markdown e sem texto extra.',
    '',
    input || 'Sistema web genérico com login, cadastro, pagamentos e relatórios.',
  ].join('\n');
}
