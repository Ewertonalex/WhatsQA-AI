import { HelpCommandService } from '../../../src/services/commands/HelpCommandService';

describe('HelpCommandService', () => {
  it('lista comandos', async () => {
    const service = new HelpCommandService();
    const result = await service.handle({
      userId: 'u1',
      phone: '5511',
      args: '',
      rawMessage: '/help',
    });

    expect(result.reply).toContain('/bug');
    expect(result.reply).toContain('/teste');
    expect(result.reply).toContain('WhatsQA AI');
  });
});
