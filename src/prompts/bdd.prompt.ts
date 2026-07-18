export function buildBddPrompt(input: string): string {
  return [
    'Gere artefatos BDD em Gherkin (português) contendo:',
    'Feature, Background, Scenario, Scenario Outline e Examples.',
    'Use linguagem clara orientada a comportamento.',
    '',
    input,
  ].join('\n');
}
