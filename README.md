# AI Institutional Market Research Platform

Institutional-grade AI market research and scanner platform for US equities and forex.

## Stack
- Next.js App Router + React + Tailwind CSS
- Node API routes with modular AI service layer
- PostgreSQL schema via Prisma
- Optional Redis support for future distributed caching/rate limits

## Core Routes
- `/overview`
- `/research`
- `/scanner`
- `/insights`
- `/analytics`
- `/settings`

## Architecture
- `components/ui`, `components/layout`, `components/charts`
- `services/ai` for prompt and model orchestration
- `app/api/*` for product endpoints
- `lib/*` for compliance, rate limiting, auth, subscription, and utilities
- `prisma/schema.prisma` for relational model

## Compliance Principles
- No direct financial advice
- No buy/sell instruction language
- Institutional neutral tone
- Disclaimer appended in research contexts

## Run
```bash
npm install
npm run dev
```
