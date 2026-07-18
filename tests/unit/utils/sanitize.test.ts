import { normalizePhone, sanitizeText } from '../../../src/utils/sanitize';
import { calculateCostUsd } from '../../../src/utils/costCalculator';

describe('sanitize e custo', () => {
  it('remove caracteres de controle e corta tamanho', () => {
    const dirty = `ok\u0000teste${'a'.repeat(9000)}`;
    const clean = sanitizeText(dirty, 10);
    expect(clean.includes('\u0000')).toBe(false);
    expect(clean.length).toBeLessThanOrEqual(10);
  });

  it('normaliza telefone', () => {
    expect(normalizePhone('+55 (11) 99999-8888')).toBe('5511999998888');
  });

  it('calcula custo aproximado', () => {
    const cost = calculateCostUsd('gpt-4o-mini', 1_000_000, 1_000_000);
    expect(cost).toBeCloseTo(0.75, 5);
  });
});
