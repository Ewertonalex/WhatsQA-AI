/**
 * Smoke opcional com OpenAI real.
 * Uso: npm run smoke:openai
 */
const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000';
const TOKEN = process.env.DASHBOARD_TOKEN ?? process.env.SMOKE_TOKEN ?? 'change-me-dashboard-token';

async function run(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/chat/simulate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-token': TOKEN,
    },
    body: JSON.stringify({
      phone: '5511777666555',
      message: '/explicar o que é teste de regressão em uma frase',
    }),
  });

  const payload = (await response.json()) as { reply?: string; error?: string };

  if (response.status !== 200 || !payload.reply || payload.reply.length < 20) {
    // eslint-disable-next-line no-console
    console.error('FAIL smoke:openai', response.status, payload);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('PASS smoke:openai');
  // eslint-disable-next-line no-console
  console.log(payload.reply.slice(0, 300));
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'erro desconhecido';
  // eslint-disable-next-line no-console
  console.error(message);
  process.exit(1);
});
