import type { AuditEvent, Portfolio, Position, Trade } from "./types";

/**
 * Fixed reference clock for the demo so server and client render identically
 * (no hydration drift). In production this is simply Date.now().
 */
export const DEMO_NOW = 1749300000000; // ~ Jun 2025, stable anchor

const OWNER = "master-trader";
const DAY = 86_400_000;
const HOUR = 3_600_000;

export const portfolios: Portfolio[] = [
  { id: "core", ownerId: OWNER, name: "Core Spot", baseCurrency: "USDT", exchange: "Binance" },
  { id: "swing", ownerId: OWNER, name: "Swing Book", baseCurrency: "USDT", exchange: "Binance" },
  { id: "alt", ownerId: OWNER, name: "Alt Basket", baseCurrency: "USDT", exchange: "Bybit" },
];

/** Average entries are realistic; live prices come from the exchange at runtime. */
export const positions: Position[] = [
  { portfolioId: "core", symbol: "BTC", pair: "BTCUSDT", quantity: 0.84, avgEntry: 58200 },
  { portfolioId: "core", symbol: "ETH", pair: "ETHUSDT", quantity: 9.5, avgEntry: 2980 },
  { portfolioId: "swing", symbol: "SOL", pair: "SOLUSDT", quantity: 145, avgEntry: 142 },
  { portfolioId: "swing", symbol: "BNB", pair: "BNBUSDT", quantity: 18, avgEntry: 545 },
  { portfolioId: "alt", symbol: "XRP", pair: "XRPUSDT", quantity: 12000, avgEntry: 0.52 },
  { portfolioId: "alt", symbol: "ADA", pair: "ADAUSDT", quantity: 9000, avgEntry: 0.41 },
];

export const trades: Trade[] = [
  {
    id: "T-1043", ownerId: OWNER, portfolioId: "swing", pair: "SOLUSDT", side: "buy",
    status: "open", entry: 142.0, quantity: 145, feePct: 0.1,
    openedAt: DEMO_NOW - 2 * DAY - 3 * HOUR, note: "Range reclaim, scaling in on dips.",
  },
  {
    id: "T-1042", ownerId: OWNER, portfolioId: "core", pair: "ETHUSDT", side: "buy",
    status: "open", entry: 2980, quantity: 9.5, feePct: 0.1,
    openedAt: DEMO_NOW - 6 * DAY, note: "Core accumulation tranche 2.",
  },
  {
    id: "T-1041", ownerId: OWNER, portfolioId: "swing", pair: "BNBUSDT", side: "buy",
    status: "closed", entry: 512, exit: 578, quantity: 18, feePct: 0.1,
    openedAt: DEMO_NOW - 11 * DAY, closedAt: DEMO_NOW - 4 * DAY,
    note: "Breakout continuation. Took profit into resistance.",
  },
  {
    id: "T-1040", ownerId: OWNER, portfolioId: "alt", pair: "XRPUSDT", side: "buy",
    status: "closed", entry: 0.49, exit: 0.47, quantity: 12000, feePct: 0.1,
    openedAt: DEMO_NOW - 14 * DAY, closedAt: DEMO_NOW - 9 * DAY,
    note: "Failed reclaim, cut per risk rule (-2R stop).",
  },
  {
    id: "T-1039", ownerId: OWNER, portfolioId: "core", pair: "BTCUSDT", side: "buy",
    status: "closed", entry: 54200, exit: 61800, quantity: 0.5, feePct: 0.1,
    openedAt: DEMO_NOW - 21 * DAY, closedAt: DEMO_NOW - 12 * DAY,
    note: "Swing long off support. Trailed exit.",
  },
];

export const auditEvents: AuditEvent[] = [
  { id: "A-220", ownerId: OWNER, at: DEMO_NOW - 5 * 60_000, actor: "Master Trader", action: "VIEW_BALANCES", target: "portfolio:core", meta: "read-only API key · Binance" },
  { id: "A-219", ownerId: OWNER, at: DEMO_NOW - 42 * 60_000, actor: "Master Trader", action: "OPEN_TRADE", target: "T-1043 SOLUSDT", meta: "qty 145 @ 142.00" },
  { id: "A-218", ownerId: OWNER, at: DEMO_NOW - 3 * HOUR, actor: "system", action: "API_RECONCILE", target: "portfolio:swing", meta: "fills synced · 0 discrepancies" },
  { id: "A-217", ownerId: OWNER, at: DEMO_NOW - 4 * HOUR, actor: "Master Trader", action: "LOGIN_MFA", target: "session", meta: "TOTP verified · ip allow-listed" },
  { id: "A-216", ownerId: OWNER, at: DEMO_NOW - 4 * DAY, actor: "Master Trader", action: "CLOSE_TRADE", target: "T-1041 BNBUSDT", meta: "exit 578.00 · +11.5%" },
  { id: "A-215", ownerId: OWNER, at: DEMO_NOW - 4 * DAY - HOUR, actor: "system", action: "RATE_LIMIT_BACKOFF", target: "binance:klines", meta: "429 handled · retry after 1.2s" },
];

/** Synthetic 30-point equity curve (USDT) for the dashboard. Deterministic. */
export const equityCurve: { t: number; equity: number }[] = Array.from({ length: 30 }, (_, i) => {
  const drift = 100_000 + i * 850;
  const wave = Math.sin(i / 2.3) * 3200 + Math.cos(i / 5) * 1500;
  return { t: DEMO_NOW - (29 - i) * DAY, equity: Math.round(drift + wave) };
});
