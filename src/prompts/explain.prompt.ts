export function buildExplainPrompt(input: string): string {
  return [
    'Explique o conteúdo abaixo sob a ótica de QA:',
    'o que é, por que importa, riscos, como testar e checklist prático.',
    '',
    input,
  ].join('\n');
}
