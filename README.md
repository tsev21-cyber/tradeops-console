# TradeOps — Internal Trading Console

A **Phase 1 MVP prototype** of an internal trading-operations console for private
"Master Trader" use: portfolio monitoring, trade planning and journaling, live
exchange market data, risk review, an internal account statement, and an
append-only audit log.

> **Note on this repository.** This is a purpose-built prototype created to
> demonstrate technical approach and capability for a technical-validation
> process. It uses **public exchange market data only** (no API keys, no private
> account access, no funds). Portfolio and trade records are seed/demo data.

---

## Why it exists

It mirrors, in working software, the Phase 1 modules of an internal trading tool:
the goal is to *show* the architecture, the exchange-integration approach, the
security model, and the UI/UX — rather than describe them on paper.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (end-to-end) |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Icons | lucide-react |
| Live data | Binance public REST + WebSocket (no credentials) |
| Deploy | Vercel |

The production design extends this with a NestJS API, a Python/CCXT exchange
service, PostgreSQL + TimescaleDB, and Redis — see the in-app **Roadmap** and
**Architecture** views.

## Modules (Phase 1 map)

- **Dashboard / KPIs** — consolidated equity, P&L, win rate, equity curve
- **Live Market** — real-time prices via Binance public WebSocket
- **Portfolios** — multi-portfolio view, live-priced positions
- **Trade Journal** — open/closed trades, entries, exits, fees, notes
- **DCA / Average-Price Calculator** — multi-entry planning tool
- **Account Statement** — internal balances and results
- **Risk Review** — exposure and pre-trade checks
- **Audit Log** — append-only record of actions and API events

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

## Architecture (summary)

A **modular monolith** with bounded domain modules under `src/modules`
(`exchange`, `portfolio`, `trading`, `risk`, `audit`, `security`), thin route
composition under `src/app`, and shared UI in `src/components`. Every domain
record carries an `ownerId` so the same schema supports multiple accounts in
Phase 2 without a migration.

---

*Prototype for technical validation — not a production system.*
