export function buildPostmanPrompt(input: string): string {
  return [
    'Gere estrutura de coleção Postman (requests, pastas, variáveis, testes e scripts)',
    'com cobertura de autenticação, CRUD e cenários negativos.',
    '',
    input,
  ].join('\n');
}
