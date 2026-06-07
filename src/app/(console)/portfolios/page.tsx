import { PageHeader } from "@/components/PageHeader";
import { PortfoliosView } from "@/components/PortfoliosView";
import { fetchTickers } from "@/modules/exchange/binance";
import { WATCHLIST_PAIRS } from "@/modules/exchange/symbols";
import type { PriceMap } from "@/modules/portfolio/logic";

export const dynamic = "force-dynamic";

export default async function PortfoliosPage() {
  const initialPrices: PriceMap = {};
  try {
    const tickers = await fetchTickers([...WATCHLIST_PAIRS]);
    for (const t of tickers) initialPrices[t.pair] = t.last;
  } catch {
    // Live prices will fill in from the WebSocket; valuation falls back to avg entry.
  }

  return (
    <>
      <PageHeader
        title="Portfolios"
        subtitle="Multiple internal portfolios, valued at live market prices"
      />
      <PortfoliosView initialPrices={initialPrices} />
    </>
  );
}
