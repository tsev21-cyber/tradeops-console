import type { Trade } from "@/modules/types";

/**
 * Trading domain logic — pure, framework-free, unit-testable.
 * Lives in the `trading` bounded context; UI and API both call into it.
 */

/** Net realized P&L for a closed trade, after maker/taker fees on both legs. */
export function realizedPnl(t: Trade): number | null {
  if (t.status !== "closed" || t.exit == null) return null;
  const direction = t.side === "buy" ? 1 : -1;
  const gross = (t.exit - t.entry) * t.quantity * direction;
  const fees = (t.entry + t.exit) * t.quantity * (t.feePct / 100);
  return gross - fees;
}

/** Realized P&L as a percentage of cost basis. */
export function realizedPnlPct(t: Trade): number | null {
  const pnl = realizedPnl(t);
  if (pnl == null) return null;
  return (pnl / (t.entry * t.quantity)) * 100;
}

/** Cost basis (notional at entry). */
export function notional(t: Trade): number {
  return t.entry * t.quantity;
}

export interface TradeStats {
  closed: number;
  open: number;
  wins: number;
  losses: number;
  winRate: number;
  netRealized: number;
}

/** Aggregate journal statistics across a set of trades. */
export function tradeStats(trades: Trade[]): TradeStats {
  const closed = trades.filter((t) => t.status === "closed");
  const open = trades.length - closed.length;
  let wins = 0;
  let losses = 0;
  let netRealized = 0;
  for (const t of closed) {
    const pnl = realizedPnl(t) ?? 0;
    netRealized += pnl;
    if (pnl > 0) wins++;
    else if (pnl < 0) losses++;
  }
  return {
    closed: closed.length,
    open,
    wins,
    losses,
    winRate: closed.length ? (wins / closed.length) * 100 : 0,
    netRealized,
  };
}
