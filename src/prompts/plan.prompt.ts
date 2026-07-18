export function buildPlanPrompt(input: string): string {
  return [
    'Gere um Plano de Testes completo contendo:',
    'Escopo, Objetivos, Riscos, Cronograma, Estratégia,',
    'Critérios de entrada e Critérios de saída.',
    '',
    input,
  ].join('\n');
}
