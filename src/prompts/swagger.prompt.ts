export function buildSwaggerPrompt(input: string): string {
  return [
    'A partir da especificação/descrição abaixo, gere análise de testes baseada em Swagger/OpenAPI:',
    'endpoints críticos, contratos, validações, dados de teste e lacunas de documentação.',
    '',
    input,
  ].join('\n');
}
