# WhatsQA AI

<p align="center">
  <img src="public/assets/brand/banner.png" alt="WhatsQA AI — Suporte Tech para QA" width="720" />
</p>

<p align="center">
  <img src="public/assets/brand/logo.png" alt="Logo WhatsQA AI" width="280" />
</p>

Assistente inteligente especializado em **Engenharia de Qualidade de Software (QA)**, com interface inicial via WhatsApp e dashboard administrativo web.

**Tagline:** SUPORTE TECH PARA QA

> Projeto profissional, orientado a Clean Architecture, SOLID, tipagem estrita e evolução para SaaS.

## Stack

- Node.js + TypeScript
- Express
- Prisma ORM + SQLite (pronto para PostgreSQL)
- OpenAI API
- whatsapp-web.js (LocalAuth)
- Winston, Zod, Jest, ESLint, Prettier
- Docker

## Estrutura

```text
src/
  config/          # Env, logger, constants
  controllers/     # HTTP controllers
  services/        # Regras de negócio / comandos QA
  repositories/    # Persistência (Repository Pattern)
  entities/        # Entidades de domínio
  database/        # Prisma client
  middlewares/     # Express middlewares
  routes/          # Rotas HTTP
  prompts/         # Prompts por comando
  utils/           # Helpers
  types/           # Tipos compartilhados
  validators/      # Schemas Zod
  interfaces/      # Contratos (SOLID)
  whatsapp/        # Cliente e handlers WhatsApp
  dashboard/       # Camada do dashboard
tests/
prisma/
imagens/           # Originais de marca (banner/logo)
public/assets/brand/  # Assets servidos no dashboard/README
sessions/          # LocalAuth (não versionar)
logs/              # Winston (não versionar)
```

## Pré-requisitos

- Node.js >= 20
- npm
- Conta OpenAI
- Chrome/Chromium (para whatsapp-web.js)

## Setup rápido (M1)

```bash
cp .env.example .env
npm install
npm run typecheck
npm test
npm run dev
```

Healthcheck:

```bash
curl http://localhost:3000/health
```

## Variáveis de ambiente

Veja `.env.example`:

- `BOT_NAME`
- `OPENAI_API_KEY`
- `DATABASE_URL`
- `SESSION_NAME`
- `ADMIN_NUMBER`
- `LOG_LEVEL`
- `OPENAI_MODEL`
- `MAX_TOKENS`
- `TEMPERATURE`
- `PORT`

A sessão WhatsApp **não depende do número do chip**. Trocar o número = nova autenticação via QR Code (`SESSION_NAME` / pasta `sessions/`).

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento com reload |
| `npm run build` | Compila TypeScript |
| `npm start` | Executa build |
| `npm test` | Jest |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |

## Docker

```bash
docker compose up --build
```

Volumes persistentes: `sessions/`, `logs/`, banco Prisma.

## Ordem de implementação

1. **M1** Fundação (este módulo)
2. M2 Config + Logger
3. M3 Database + Prisma
4. M4 Repositories
5. M5 OpenAIService
6. M6 Domain services base
7. M7 Command Parser + Router
8. M8–M10 Comandos QA
9. M11 WhatsApp Client
10. M12 Express completo
11. M13 Dashboard
12. M14 Hardening

## Licença

UNLICENSED — uso interno / produto comercial.
