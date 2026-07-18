/**
 * Smoke test de runtime — valida que o servidor está saudável e os fluxos críticos respondem.
 * Uso: npm run smoke
 */
const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000';
const TOKEN = process.env.DASHBOARD_TOKEN ?? process.env.SMOKE_TOKEN ?? 'change-me-dashboard-token';

interface SmokeResult {
  name: string;
  ok: boolean;
  detail: string;
}

async function request(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; json?: unknown; text?: string; contentType?: string }> {
  const response = await fetch(`${BASE_URL}${path}`, init);
  const contentType = response.headers.get('content-type') ?? undefined;
  if (contentType?.includes('application/json')) {
    return { status: response.status, json: await response.json(), contentType };
  }
  return { status: response.status, text: await response.text(), contentType };
}

async function run(): Promise<void> {
  const results: SmokeResult[] = [];

  const health = await request('/health');
  results.push({
    name: 'GET /health',
    ok: health.status === 200 && (health.json as { status?: string })?.status === 'ok',
    detail: `status=${health.status}`,
  });

  const logo = await request('/assets/brand/logo.png');
  results.push({
    name: 'GET logo',
    ok: logo.status === 200 && Boolean(logo.contentType?.includes('image')),
    detail: `status=${logo.status} type=${logo.contentType ?? 'n/a'}`,
  });

  const dashboard = await request('/dashboard.html');
  results.push({
    name: 'GET dashboard',
    ok: dashboard.status === 200,
    detail: `status=${dashboard.status}`,
  });

  const metricsUnauthorized = await request('/api/metrics');
  results.push({
    name: 'GET /api/metrics sem token',
    ok: metricsUnauthorized.status === 401,
    detail: `status=${metricsUnauthorized.status}`,
  });

  const metrics = await request('/api/metrics', {
    headers: { 'x-admin-token': TOKEN },
  });
  results.push({
    name: 'GET /api/metrics com token',
    ok:
      metrics.status === 200 &&
      typeof (metrics.json as { users?: number })?.users === 'number',
    detail: `status=${metrics.status}`,
  });

  const help = await request('/api/chat/simulate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-token': TOKEN,
    },
    body: JSON.stringify({
      phone: '5511888777666',
      name: 'Smoke Tester',
      message: '/help',
    }),
  });
  const helpReply = (help.json as { reply?: string })?.reply ?? '';
  results.push({
    name: 'POST /api/chat/simulate /help',
    ok: help.status === 200 && helpReply.includes('/bug'),
    detail: `status=${help.status} replyLength=${helpReply.length}`,
  });

  const bugStart = await request('/api/chat/simulate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-token': TOKEN,
    },
    body: JSON.stringify({
      phone: '5511888777666',
      message: '/bug',
    }),
  });
  const bugReply = (bugStart.json as { reply?: string })?.reply ?? '';
  results.push({
    name: 'POST /api/chat/simulate /bug (início fluxo)',
    ok: bugStart.status === 200 && bugReply.toLowerCase().includes('título'),
    detail: `status=${bugStart.status}`,
  });

  let failed = 0;
  for (const result of results) {
    const mark = result.ok ? 'PASS' : 'FAIL';
    // eslint-disable-next-line no-console
    console.log(`[${mark}] ${result.name} — ${result.detail}`);
    if (!result.ok) {
      failed += 1;
    }
  }

  if (failed > 0) {
    // eslint-disable-next-line no-console
    console.error(`\nSmoke falhou: ${failed}/${results.length}`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`\nSmoke OK: ${results.length}/${results.length}`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'erro desconhecido';
  // eslint-disable-next-line no-console
  console.error(`Smoke interrompido: ${message}`);
  process.exit(1);
});
