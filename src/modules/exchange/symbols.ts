/** Watchlist of pairs the console tracks. Quote currency is USDT throughout. */
export const WATCHLIST = [
  { symbol: "BTC", pair: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETH", pair: "ETHUSDT", name: "Ethereum" },
  { symbol: "SOL", pair: "SOLUSDT", name: "Solana" },
  { symbol: "BNB", pair: "BNBUSDT", name: "BNB" },
  { symbol: "XRP", pair: "XRPUSDT", name: "XRP" },
  { symbol: "ADA", pair: "ADAUSDT", name: "Cardano" },
  { symbol: "DOGE", pair: "DOGEUSDT", name: "Dogecoin" },
  { symbol: "AVAX", pair: "AVAXUSDT", name: "Avalanche" },
  { symbol: "LINK", pair: "LINKUSDT", name: "Chainlink" },
  { symbol: "MATIC", pair: "MATICUSDT", name: "Polygon" },
] as const;

export const WATCHLIST_PAIRS = WATCHLIST.map((w) => w.pair);

export function nameForPair(pair: string): string {
  return WATCHLIST.find((w) => w.pair === pair)?.name ?? pair;
}
