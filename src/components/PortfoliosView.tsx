"use client";

import { useMemo } from "react";
import { Card, CardHeader, Badge, Delta } from "@/components/ui";
import { usd, qty } from "@/lib/utils";
import { portfolios, positions } from "@/modules/seed";
import { valuePortfolio, type PriceMap } from "@/modules/portfolio/logic";
import { WATCHLIST_PAIRS } from "@/modules/exchange/symbols";
import { useLivePrices } from "@/modules/exchange/useLivePrices";

export function PortfoliosView({ initialPrices }: { initialPrices: PriceMap }) {
  const pairs = useMemo(() => [...WATCHLIST_PAIRS], []);
  const { prices: live } = useLivePrices(pairs);

  // Live ticks override the server snapshot; snapshot covers anything not yet streamed.
  const priceMap: PriceMap = { ...initialPrices };
  for (const [pair, tick] of Object.entries(live)) priceMap[pair] = tick.price;

  const grandValue = portfolios.reduce(
    (s, p) => s + valuePortfolio(positions.filter((x) => x.portfolioId === p.id), priceMap).marketValue,
    0,
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-xs text-muted">Consolidated market value (live)</p>
        <p className="mt-1 text-3xl font-semibold tnum">{usd(grandValue)}</p>
        <p className="mt-1 text-xs text-faint">Across {portfolios.length} portfolios · valued at live prices</p>
      </Card>

      {portfolios.map((p) => {
        const v = valuePortfolio(positions.filter((x) => x.portfolioId === p.id), priceMap);
        return (
          <Card key={p.id}>
            <CardHeader
              title={p.name}
              subtitle={`${p.exchange} · ${p.baseCurrency}`}
              action={
                <div className="text-right">
                  <p className="tnum text-sm font-semibold text-text">{usd(v.marketValue)}</p>
                  <Delta value={v.unrealizedPct} />
                </div>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-left text-xs text-faint">
                    <th className="px-5 py-2 font-medium">Asset</th>
                    <th className="px-5 py-2 text-right font-medium">Qty</th>
                    <th className="px-5 py-2 text-right font-medium">Avg entry</th>
                    <th className="px-5 py-2 text-right font-medium">Live price</th>
                    <th className="px-5 py-2 text-right font-medium">Value</th>
                    <th className="px-5 py-2 text-right font-medium">Unrealized</th>
                  </tr>
                </thead>
                <tbody>
                  {v.positions.map((pos) => (
                    <tr key={pos.symbol} className="border-b border-border-soft last:border-0">
                      <td className="px-5 py-2.5 font-medium text-text">
                        {pos.symbol}
                        <Badge className="ml-2" tone="neutral">
                          {pos.pair.replace("USDT", "")}/USDT
                        </Badge>
                      </td>
                      <td className="px-5 py-2.5 text-right tnum text-muted">{qty(pos.quantity)}</td>
                      <td className="px-5 py-2.5 text-right tnum text-muted">{usd(pos.avgEntry, pos.avgEntry < 1 ? 4 : 2)}</td>
                      <td className="px-5 py-2.5 text-right tnum text-text">{usd(pos.price, pos.price < 1 ? 4 : 2)}</td>
                      <td className="px-5 py-2.5 text-right tnum text-text">{usd(pos.marketValue)}</td>
                      <td className="px-5 py-2.5 text-right">
                        <Delta value={pos.unrealizedPct} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
