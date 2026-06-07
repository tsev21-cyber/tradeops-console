"use client";

import { useMemo } from "react";
import type { Ticker24h } from "@/modules/exchange/binance";
import { WATCHLIST_PAIRS, nameForPair } from "@/modules/exchange/symbols";
import { useLivePrices, type ConnState } from "@/modules/exchange/useLivePrices";
import { Card, CardHeader, Delta } from "@/components/ui";
import { usd, usdCompact } from "@/lib/utils";
import { cn } from "@/lib/utils";

const stateLabel: Record<ConnState, { text: string; dot: string }> = {
  connecting: { text: "connecting…", dot: "bg-warn" },
  live: { text: "live", dot: "bg-up" },
  reconnecting: { text: "reconnecting…", dot: "bg-warn" },
  offline: { text: "offline", dot: "bg-down" },
};

export function LiveMarket({ initial }: { initial: Ticker24h[] }) {
  const pairs = useMemo(() => [...WATCHLIST_PAIRS], []);
  const { prices, state } = useLivePrices(pairs);

  const rows = initial.map((t) => {
    const live = prices[t.pair];
    const last = live?.price ?? t.last;
    const tickDir = live ? Math.sign(live.price - live.prevPrice) : 0;
    return { ...t, last, tickDir };
  });

  const s = stateLabel[state];

  return (
    <Card>
      <CardHeader
        title="Watchlist"
        subtitle="Live prices · Binance public WebSocket stream"
        action={
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className={cn("live-dot h-2 w-2 rounded-full", s.dot)} />
            {s.text}
          </span>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-soft text-left text-xs text-faint">
              <th className="px-5 py-2.5 font-medium">Pair</th>
              <th className="px-5 py-2.5 text-right font-medium">Last price</th>
              <th className="px-5 py-2.5 text-right font-medium">24h</th>
              <th className="hidden px-5 py-2.5 text-right font-medium sm:table-cell">24h high</th>
              <th className="hidden px-5 py-2.5 text-right font-medium sm:table-cell">24h low</th>
              <th className="hidden px-5 py-2.5 text-right font-medium md:table-cell">Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pair} className="border-b border-border-soft last:border-0 hover:bg-elevated/40">
                <td className="px-5 py-3">
                  <div className="font-medium text-text">{r.pair.replace("USDT", "")}/USDT</div>
                  <div className="text-[11px] text-faint">{nameForPair(r.pair)}</div>
                </td>
                <td
                  className={cn(
                    "px-5 py-3 text-right tnum tabular-nums transition-colors",
                    r.tickDir > 0 && "text-up",
                    r.tickDir < 0 && "text-down",
                    r.tickDir === 0 && "text-text",
                  )}
                >
                  {usd(r.last, r.last < 1 ? 5 : 2)}
                </td>
                <td className="px-5 py-3 text-right">
                  <Delta value={r.changePct} />
                </td>
                <td className="hidden px-5 py-3 text-right tnum text-muted sm:table-cell">
                  {usd(r.high, r.high < 1 ? 5 : 2)}
                </td>
                <td className="hidden px-5 py-3 text-right tnum text-muted sm:table-cell">
                  {usd(r.low, r.low < 1 ? 5 : 2)}
                </td>
                <td className="hidden px-5 py-3 text-right tnum text-muted md:table-cell">
                  {usdCompact(r.quoteVolume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
