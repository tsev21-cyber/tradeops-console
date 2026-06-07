/**
 * Shared domain types for the trading console.
 * Every record carries an `ownerId` from day one so the same schema
 * supports multiple client accounts in Phase 2 without a migration.
 */

export type Side = "buy" | "sell";
export type TradeStatus = "open" | "closed";

export interface Portfolio {
  id: string;
  ownerId: string;
  name: string;
  baseCurrency: "USDT";
  exchange: string;
}

export interface Position {
  portfolioId: string;
  symbol: string; // e.g. "BTC"
  pair: string; // e.g. "BTCUSDT"
  quantity: number;
  avgEntry: number; // average entry price in quote currency
}

export interface Trade {
  id: string;
  ownerId: string;
  portfolioId: string;
  pair: string;
  side: Side;
  status: TradeStatus;
  entry: number;
  exit?: number;
  quantity: number;
  feePct: number;
  openedAt: number; // epoch ms
  closedAt?: number;
  note?: string;
}

export interface AuditEvent {
  id: string;
  ownerId: string;
  at: number;
  actor: string;
  action: string;
  target: string;
  meta?: string;
}
