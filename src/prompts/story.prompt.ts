export function buildStoryPrompt(input: string): string {
  return [
    'Refine a User Story em formato profissional com:',
    'Como/Quero/Para, critérios de aceitação, regras de negócio, restrições e perguntas em aberto.',
    '',
    input,
  ].join('\n');
}
