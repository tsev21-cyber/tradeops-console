import type { Position } from "@/modules/types";

/** Live price lookup keyed by trading pair, e.g. { BTCUSDT: 61234.5 }. */
export type PriceMap = Record<string, number>;

export interface ValuedPosition extends Position {
  price: number;
  marketValue: number;
  costBasis: number;
  unrealized: number;
  unrealizedPct: number;
}

/** Value a single position against a live price (falls back to avg entry). */
export function valuePosition(p: Position, prices: PriceMap): ValuedPosition {
  const price = prices[p.pair] ?? p.avgEntry;
  const marketValue = price * p.quantity;
  const costBasis = p.avgEntry * p.quantity;
  const unrealized = marketValue - costBasis;
  return {
    ...p,
    price,
    marketValue,
    costBasis,
    unrealized,
    unrealizedPct: costBasis ? (unrealized / costBasis) * 100 : 0,
  };
}

export interface PortfolioValuation {
  marketValue: number;
  costBasis: number;
  unrealized: number;
  unrealizedPct: number;
  positions: ValuedPosition[];
}

/** Aggregate a set of positions into a portfolio valuation. */
export function valuePortfolio(positions: Position[], prices: PriceMap): PortfolioValuation {
  const valued = positions.map((p) => valuePosition(p, prices));
  const marketValue = valued.reduce((s, v) => s + v.marketValue, 0);
  const costBasis = valued.reduce((s, v) => s + v.costBasis, 0);
  const unrealized = marketValue - costBasis;
  return {
    marketValue,
    costBasis,
    unrealized,
    unrealizedPct: costBasis ? (unrealized / costBasis) * 100 : 0,
    positions: valued,
  };
}
