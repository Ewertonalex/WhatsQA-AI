import { CommandParserService } from '../../../src/services/CommandParserService';

describe('CommandParserService', () => {
  const parser = new CommandParserService();

  it('reconhece comandos válidos', () => {
    const parsed = parser.parse('/bug login quebra no safari');
    expect(parsed.isCommand).toBe(true);
    expect(parsed.name).toBe('bug');
    expect(parsed.args).toBe('login quebra no safari');
  });

  it('trata mensagem livre', () => {
    const parsed = parser.parse('o último bug que gerei');
    expect(parsed.isCommand).toBe(false);
    expect(parsed.name).toBeNull();
  });

  it('ignora comando desconhecido como texto livre', () => {
    const parsed = parser.parse('/foo bar');
    expect(parsed.isCommand).toBe(false);
  });
});
