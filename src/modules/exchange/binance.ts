/**
 * Binance market-data connector (server-side).
 *
 * Uses the PUBLIC market-data host (data-api.binance.vision) — no API key, no
 * account access, no funds. This is the same shape an authenticated connector
 * takes; in production the authenticated calls run through CCXT with encrypted,
 * read-only, IP-allow-listed keys (see the Security module).
 *
 * Demonstrates the production concerns the client asked about:
 *   - rate-limit (HTTP 429) handling with Retry-After + exponential backoff
 *   - transient 5xx retries
 *   - a hard timeout per request so a hung exchange can't hang the app
 */

const BASE = "https://data-api.binance.vision";

export interface Ticker24h {
  pair: string;
  last: number;
  changePct: number;
  high: number;
  low: number;
  quoteVolume: number;
}

export interface RawError {
  error: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fetch with timeout, 429-aware backoff, and limited 5xx retries. */
async function getJson<T>(path: string, attempt = 0): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      signal: controller.signal,
      // Cache at the edge for a few seconds: smooths bursts and protects the
      // exchange rate limit without making the data feel stale.
      next: { revalidate: 5 },
      headers: { Accept: "application/json" },
    });

    if (res.status === 429 || res.status === 418) {
      // Respect the exchange's Retry-After; fall back to exponential backoff.
      const retryAfter = Number(res.headers.get("retry-after")) || Math.min(2 ** attempt, 8);
      if (attempt < 3) {
        await sleep(retryAfter * 1000);
        return getJson<T>(path, attempt + 1);
      }
      throw new Error(`rate-limited after ${attempt} retries`);
    }

    if (res.status >= 500 && attempt < 3) {
      await sleep(Math.min(2 ** attempt, 8) * 250);
      return getJson<T>(path, attempt + 1);
    }

    if (!res.ok) throw new Error(`exchange responded ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  quoteVolume: string;
}

/** 24h ticker stats for a set of pairs. */
export async function fetchTickers(pairs: string[]): Promise<Ticker24h[]> {
  const symbolsParam = encodeURIComponent(JSON.stringify(pairs));
  const raw = await getJson<BinanceTicker[]>(`/api/v3/ticker/24hr?symbols=${symbolsParam}`);
  return raw.map((t) => ({
    pair: t.symbol,
    last: Number(t.lastPrice),
    changePct: Number(t.priceChangePercent),
    high: Number(t.highPrice),
    low: Number(t.lowPrice),
    quoteVolume: Number(t.quoteVolume),
  }));
}

/** Closing prices for a sparkline, oldest → newest. */
export async function fetchSparkline(pair: string, interval = "1h", limit = 24): Promise<number[]> {
  const raw = await getJson<unknown[][]>(
    `/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`,
  );
  // Kline tuple index 4 is the close price.
  return raw.map((k) => Number(k[4]));
}
