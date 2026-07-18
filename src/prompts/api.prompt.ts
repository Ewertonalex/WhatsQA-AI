export function buildApiPrompt(input: string): string {
  return [
    'Gere uma coleção completa de testes de API no estilo Postman, cobrindo:',
    '200, 201, 204, 400, 401, 403, 404, 409, 422, 500,',
    'payload, headers, tempo de resposta, validação JSON e casos negativos.',
    'Inclua asserts sugeridos e exemplos de request/response.',
    '',
    input,
  ].join('\n');
}
