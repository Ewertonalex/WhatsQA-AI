import {
  APP_NAME,
  APP_TAGLINE,
  BRAND_ASSETS,
  COMMAND_PREFIX,
  SUPPORTED_COMMANDS,
} from '../../../src/config/constants';
import { createApp } from '../../../src/app';
import { createContainer } from '../../../src/container';
import request from 'supertest';

describe('Fundação + HTTP', () => {
  const container = createContainer();
  const app = createApp(container);

  it('deve expor constantes do produto', () => {
    expect(APP_NAME).toBe('WhatsQA AI');
    expect(APP_TAGLINE).toBe('SUPORTE TECH PARA QA');
    expect(BRAND_ASSETS.logo).toBe('/assets/brand/logo.png');
    expect(BRAND_ASSETS.banner).toBe('/assets/brand/banner.png');
    expect(COMMAND_PREFIX).toBe('/');
    expect(SUPPORTED_COMMANDS).toContain('help');
    expect(SUPPORTED_COMMANDS).toContain('bug');
  });

  it('deve responder healthcheck', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'WhatsQA AI',
      tagline: 'SUPORTE TECH PARA QA',
    });
  });

  it('deve servir assets de marca', async () => {
    const logo = await request(app).get('/assets/brand/logo.png');
    const banner = await request(app).get('/assets/brand/banner.png');

    expect(logo.status).toBe(200);
    expect(logo.headers['content-type']).toMatch(/image\/png/);
    expect(banner.status).toBe(200);
    expect(banner.headers['content-type']).toMatch(/image\/png/);
  });

  it('deve proteger métricas sem token', async () => {
    const response = await request(app).get('/api/metrics');
    expect(response.status).toBe(401);
  });

  it('deve retornar métricas com token', async () => {
    const response = await request(app)
      .get('/api/metrics')
      .set('x-admin-token', 'test-dashboard-token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('messages');
    expect(response.body).toHaveProperty('tokens');
  });
});
