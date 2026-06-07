import { NextResponse } from "next/server";
import { fetchTickers } from "@/modules/exchange/binance";
import { WATCHLIST_PAIRS } from "@/modules/exchange/symbols";

/**
 * GET /api/market/tickers
 * Server-side proxy to the exchange. Keeps exchange access on the backend
 * (where credentials would live in production), centralizes rate-limit
 * handling, and caches briefly at the edge.
 */
export async function GET() {
  try {
    const tickers = await fetchTickers([...WATCHLIST_PAIRS]);
    return NextResponse.json(
      { tickers, ts: Date.now() },
      { headers: { "Cache-Control": "s-maxage=5, stale-while-revalidate=10" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "exchange unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
