export function buildSqlPrompt(input: string): string {
  return [
    'Gere consultas SQL úteis e explique:',
    'cada consulta, riscos, índices recomendados e considerações de performance.',
    'Prefira SQL ANSI/SQLite-compatível e indique diferenças para PostgreSQL quando relevante.',
    '',
    input,
  ].join('\n');
}
