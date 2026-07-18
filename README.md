# WhatsQA AI

<p align="center">
  <img src="public/assets/brand/banner.png" alt="WhatsQA AI — Suporte Tech para QA" width="720" />
</p>

<p align="center">
  <img src="public/assets/brand/logo.png" alt="Logo WhatsQA AI" width="280" />
</p>

Assistente inteligente especializado em **Engenharia de Qualidade de Software (QA)**, com interface via WhatsApp e dashboard administrativo web.

**Tagline:** SUPORTE TECH PARA QA

## Stack

- Node.js + TypeScript (strict)
- Express + Helmet + CORS + Rate Limit
- Prisma ORM + SQLite (pronto para PostgreSQL)
- OpenAI API (somente via `OpenAIService`)
- whatsapp-web.js (LocalAuth)
- Winston, Zod, Jest, ESLint, Prettier
- Docker

## Arquitetura

Clean Architecture + SOLID + Repository Pattern + Service Layer.

```text
WhatsApp / HTTP → Controllers/Handlers → Services → OpenAIService / Repositories → Prisma/SQLite
```

## Setup

```bash
cp .env.example .env
# preencha OPENAI_API_KEY e ADMIN_NUMBER

npm install
npx prisma migrate dev
npm test
npm run dev
```

- API/Health: http://localhost:3000/health  
- Dashboard: http://localhost:3000  
- Token: header `x-admin-token` = `DASHBOARD_TOKEN` (ou `ADMIN_NUMBER`)

### WhatsApp

1. `ENABLE_WHATSAPP=true`
2. Ao iniciar, escaneie o QR Code no terminal
3. A sessão fica em `sessions/{SESSION_NAME}` (migrável entre PCs)
4. Trocar o chip/número = nova autenticação QR; a lógica do bot não muda

Para rodar só API/dashboard:

```env
ENABLE_WHATSAPP=false
```

### Simular mensagem (sem WhatsApp)

```bash
curl -X POST http://localhost:3000/api/chat/simulate \
  -H "Content-Type: application/json" \
  -H "x-admin-token: change-me-dashboard-token" \
  -d "{\"phone\":\"5511999999999\",\"message\":\"/help\"}"
```

## Comandos

`/help` `/bug` `/teste` `/bdd` `/api` `/sql` `/cypress` `/postman` `/regressao` `/checklist` `/plano` `/riscos` `/story` `/swagger` `/explicar`

- `/bug` — fluxo conversacional guiado
- `/regressao` — checklist por módulos; marcar com `feito 1,3`

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev com reload |
| `npm run build` / `npm start` | Produção |
| `npm test` | Jest |
| `npm run lint` | ESLint |
| `npx prisma studio` | UI do banco |

## Docker

```bash
docker compose up --build
```

## Segurança

- Nunca commitar `.env`
- API Key só em variável de ambiente
- Dashboard protegido por token admin

## Licença

UNLICENSED
