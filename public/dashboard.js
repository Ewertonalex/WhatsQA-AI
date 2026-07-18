const tokenInput = document.getElementById('token');
const loadBtn = document.getElementById('loadBtn');
const statusEl = document.getElementById('status');
const content = document.getElementById('content');

const saved = localStorage.getItem('whatsqa_admin_token');
if (saved) {
  tokenInput.value = saved;
}

function kpiCard(label, value) {
  return `<article class="kpi"><span>${label}</span><strong>${value}</strong></article>`;
}

function renderList(elementId, items, mapper) {
  const el = document.getElementById(elementId);
  if (!items || items.length === 0) {
    el.innerHTML = '<li>Sem dados</li>';
    return;
  }
  el.innerHTML = items.map(mapper).join('');
}

async function loadMetrics() {
  const token = tokenInput.value.trim();
  if (!token) {
    statusEl.textContent = 'Informe o token admin.';
    return;
  }

  statusEl.textContent = 'Carregando...';
  loadBtn.disabled = true;

  try {
    const response = await fetch('/api/metrics', {
      headers: { 'x-admin-token': token },
    });

    if (!response.ok) {
      throw new Error(`Falha (${response.status})`);
    }

    const data = await response.json();
    localStorage.setItem('whatsqa_admin_token', token);
    content.classList.remove('hidden');

    document.getElementById('kpi').innerHTML = [
      kpiCard('Usuários', data.users),
      kpiCard('Mensagens', data.messages),
      kpiCard('Tokens', data.tokens),
      kpiCard('Custo approx. (USD)', Number(data.estimatedCostUsd).toFixed(4)),
      kpiCard('Tempo médio (ms)', data.avgResponseMs),
      kpiCard('Erros (30d)', data.errorsLast30d),
    ].join('');

    renderList(
      'commands',
      data.topCommands,
      (item) => `<li>/${item.name} — <strong>${item.count}</strong></li>`,
    );
    renderList(
      'users',
      data.latestUsers,
      (item) => `<li>${item.phone}${item.name ? ` (${item.name})` : ''}</li>`,
    );
    renderList(
      'daily',
      data.dailyUsage,
      (item) =>
        `<li>${item.date}: ${item.requests} req · ${item.totalTokens} tokens · $${Number(item.totalCostUsd).toFixed(4)}</li>`,
    );
    renderList(
      'monthly',
      data.monthlyUsage,
      (item) =>
        `<li>${item.date}: ${item.requests} req · ${item.totalTokens} tokens · $${Number(item.totalCostUsd).toFixed(4)}</li>`,
    );
    renderList(
      'errors',
      data.recentErrors,
      (item) => `<li>${item.createdAt}: ${item.event} — ${item.errorMessage || '-'}</li>`,
    );

    statusEl.textContent = 'Atualizado.';
  } catch (error) {
    statusEl.textContent = error instanceof Error ? error.message : 'Erro ao carregar';
    content.classList.add('hidden');
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener('click', loadMetrics);
tokenInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loadMetrics();
  }
});
