# AI Institutional Market Research Platform

Institutional-grade AI market research and scanner platform for US equities and forex.

## Stack
- Next.js App Router + React + Tailwind CSS
- TypeScript backend in `lib/*` and `app/api/*`
- PostgreSQL schema via Prisma
- Finnhub market data provider
- OpenAI research generation

## Architecture
- **Frontend**: `app/*` pages and `components/*`
- **Backend**: `app/api/*`, `lib/providers/*`, `lib/analysis/*`, `lib/ai/*`, `lib/cache/*`
- `prisma/schema.prisma` for relational models

## Run
```bash
npm install
npm run dev
```
