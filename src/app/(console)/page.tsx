"use client";

import { TrendingUp, Wallet, Activity, Target, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EquityChart } from "@/components/EquityChart";
import { Card, CardHeader, Badge, Delta } from "@/components/ui";
import { equityCurve } from "@/modules/seed";
import { useTrades } from "@/modules/store";
import { realizedPnlPct, notional, tradeStats } from "@/modules/trading/logic";
import { usd, usdCompact } from "@/lib/utils";

export default function DashboardPage() {
  const { trades } = useTrades();

  const equityNow = equityCurve[equityCurve.length - 1].equity;
  const equityStart = equityCurve[0].equity;
  const pnl30d = equityNow - equityStart;
  const pnl30dPct = (pnl30d / equityStart) * 100;

  // Live from the trade store — updates instantly when trades are added/closed.
  const stats = tradeStats(trades);

  const kpis: { label: string; value: string; icon: LucideIcon; delta?: number; sub?: string }[] = [
    { label: "Total Equity", value: usd(equityNow), delta: pnl30dPct, icon: Wallet },
    { label: "30D P&L", value: usd(pnl30d), delta: pnl30dPct, icon: TrendingUp },
    { label: "Open Trades", value: String(stats.open), sub: "live from journal", icon: Activity },
    { label: "Win Rate", value: `${stats.winRate.toFixed(0)}%`, sub: `${stats.wins}/${stats.closed} closed`, icon: Target },
  ];

  const recent = [...trades].sort((a, b) => b.openedAt - a.openedAt).slice(0, 5);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Consolidated internal performance across all portfolios">
        <Badge tone="up">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-up" />
          synced
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">{k.label}</p>
                <Icon className="h-4 w-4 text-faint" />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight tnum">{k.value}</p>
              <div className="mt-1 text-xs">
                {k.delta != null ? <Delta value={k.delta} /> : <span className="text-faint">{k.sub}</span>}
                {k.delta != null && k.sub && <span className="ml-1 text-faint">{k.sub}</span>}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Equity Curve" subtitle="Last 30 days · USDT" action={<Delta value={pnl30dPct} />} />
          <div className="p-4">
            <EquityChart data={equityCurve} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Trades" subtitle="Latest journal entries" />
          <div className="divide-y divide-border-soft">
            {recent.map((t) => {
              const pnlPct = realizedPnlPct(t);
              return (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-text">{t.pair.replace("USDT", "")}/USDT</p>
                    <p className="text-[11px] text-faint">{t.id} · {t.status}</p>
                  </div>
                  <div className="text-right">
                    {pnlPct != null ? <Delta value={pnlPct} /> : <Badge tone="primary">open</Badge>}
                    <p className="text-[11px] text-faint tnum">{usdCompact(notional(t))}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
