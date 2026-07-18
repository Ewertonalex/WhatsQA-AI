export function buildTestPrompt(userStory: string): string {
  return [
    'A partir da User Story abaixo, gere um plano de testes contendo:',
    'Objetivo, Pré-condições, Casos positivos, Casos negativos, Edge Cases,',
    'Massa de testes, Prioridade, Criticidade e Critérios de aceitação.',
    '',
    userStory,
  ].join('\n');
}
