export function buildRiskPrompt(userStory: string): string {
  return [
    'Analise a User Story e identifique:',
    'Ambiguidades, Requisitos faltantes, Possíveis falhas,',
    'Dependências, Riscos técnicos e Riscos funcionais.',
    'Priorize por impacto e probabilidade.',
    '',
    userStory,
  ].join('\n');
}
