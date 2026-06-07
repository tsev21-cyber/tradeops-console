import { PageHeader } from "@/components/PageHeader";
import { LiveMarket } from "@/components/LiveMarket";
import { Card } from "@/components/ui";
import { fetchTickers, type Ticker24h } from "@/modules/exchange/binance";
import { WATCHLIST_PAIRS } from "@/modules/exchange/symbols";

// Always render fresh on the server; the client then streams live updates.
export const dynamic = "force-dynamic";

export default async function MarketPage() {
  let initial: Ticker24h[] = [];
  let error: string | null = null;
  try {
    initial = await fetchTickers([...WATCHLIST_PAIRS]);
  } catch (err) {
    error = err instanceof Error ? err.message : "exchange unavailable";
  }

  return (
    <>
      <PageHeader
        title="Live Market"
        subtitle="Real-time market data from Binance's public API — no keys, no account access"
      />

      {error ? (
        <Card className="p-6 text-sm text-muted">
          Could not reach the exchange right now ({error}). The connector retries with
          backoff; refresh in a moment.
        </Card>
      ) : (
        <LiveMarket initial={initial} />
      )}
    </>
  );
}
