import { WelcomeService } from '../../../src/services/WelcomeService';

describe('WelcomeService', () => {
  const service = new WelcomeService();

  it('detecta saudações', () => {
    expect(service.isGreeting('oi')).toBe(true);
    expect(service.isGreeting('Olá!')).toBe(true);
    expect(service.isGreeting('/start')).toBe(true);
    expect(service.isGreeting('/menu')).toBe(true);
    expect(service.isGreeting('/bug login')).toBe(false);
    expect(service.isGreeting('gere um caso de teste')).toBe(false);
  });

  it('monta mensagem de boas-vindas com opções', () => {
    const welcome = service.buildWelcome('Ana');
    expect(welcome).toContain('Ana');
    expect(welcome).toContain('WhatsQA AI');
    expect(welcome).toContain('/bug');
    expect(welcome).toContain('O que você deseja fazer agora');
  });
});
