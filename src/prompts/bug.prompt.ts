export function buildBugPrompt(payload: {
  title: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  environment: string;
}): string {
  return [
    'Gere um bug report profissional de QA com as seções:',
    'Resumo, Descrição profissional, Severidade, Prioridade, Impacto, Criticidade,',
    'Logs necessários, Possíveis causas, Sugestões, Checklist antes de abrir o bug.',
    '',
    `Título: ${payload.title}`,
    `Descrição: ${payload.description}`,
    `Passos: ${payload.steps}`,
    `Resultado esperado: ${payload.expected}`,
    `Resultado obtido: ${payload.actual}`,
    `Ambiente: ${payload.environment}`,
  ].join('\n');
}
