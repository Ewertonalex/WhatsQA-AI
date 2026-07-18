export function buildChecklistPrompt(input: string): string {
  return [
    'Gere um checklist de QA objetivo e acionável, agrupado por categorias.',
    '',
    input,
  ].join('\n');
}
