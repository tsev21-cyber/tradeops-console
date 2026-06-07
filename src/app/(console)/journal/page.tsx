import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, Badge, Delta } from "@/components/ui";
import { trades } from "@/modules/seed";
import { realizedPnl, realizedPnlPct, notional, tradeStats } from "@/modules/trading/logic";
import { usd } from "@/lib/utils";

function fmtDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function JournalPage() {
  const stats = tradeStats(trades);

  return (
    <>
      <PageHeader title="Trade Journal" subtitle="Internal record of every trade — entries, exits, fees, notes" />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-3">
          <p className="text-xs text-muted">Net realized</p>
          <p className="mt-1 text-lg font-semibold tnum">{usd(stats.netRealized)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">Win rate</p>
          <p className="mt-1 text-lg font-semibold tnum">{stats.winRate.toFixed(0)}%</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">Open</p>
          <p className="mt-1 text-lg font-semibold tnum">{stats.open}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">Closed</p>
          <p className="mt-1 text-lg font-semibold tnum">{stats.closed}</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="All trades" subtitle={`${trades.length} entries`} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-faint">
                <th className="px-5 py-2.5 font-medium">ID</th>
                <th className="px-5 py-2.5 font-medium">Pair</th>
                <th className="px-5 py-2.5 font-medium">Side</th>
                <th className="px-5 py-2.5 text-right font-medium">Entry</th>
                <th className="px-5 py-2.5 text-right font-medium">Exit</th>
                <th className="px-5 py-2.5 text-right font-medium">Size</th>
                <th className="px-5 py-2.5 text-right font-medium">P&L</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="hidden px-5 py-2.5 font-medium lg:table-cell">Opened</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => {
                const pnl = realizedPnl(t);
                const pnlPct = realizedPnlPct(t);
                return (
                  <tr key={t.id} className="border-b border-border-soft last:border-0 align-top hover:bg-elevated/40">
                    <td className="px-5 py-3 font-mono text-xs text-faint">{t.id}</td>
                    <td className="px-5 py-3 font-medium text-text">{t.pair.replace("USDT", "")}/USDT</td>
                    <td className="px-5 py-3">
                      <Badge tone={t.side === "buy" ? "up" : "down"}>{t.side}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right tnum text-muted">{usd(t.entry, t.entry < 1 ? 4 : 2)}</td>
                    <td className="px-5 py-3 text-right tnum text-muted">{t.exit ? usd(t.exit, t.exit < 1 ? 4 : 2) : "—"}</td>
                    <td className="px-5 py-3 text-right tnum text-muted">{usd(notional(t))}</td>
                    <td className="px-5 py-3 text-right">
                      {pnl != null ? (
                        <div>
                          <div className={pnl >= 0 ? "tnum text-up" : "tnum text-down"}>{usd(pnl)}</div>
                          {pnlPct != null && <Delta value={pnlPct} />}
                        </div>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={t.status === "open" ? "primary" : "neutral"}>{t.status}</Badge>
                    </td>
                    <td className="hidden px-5 py-3 text-xs text-faint lg:table-cell">{fmtDate(t.openedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
