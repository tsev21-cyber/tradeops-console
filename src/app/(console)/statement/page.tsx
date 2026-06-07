import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, Badge } from "@/components/ui";
import { trades, DEMO_NOW } from "@/modules/seed";
import { realizedPnl } from "@/modules/trading/logic";
import { usd } from "@/lib/utils";

const DAY = 86_400_000;

interface Movement {
  at: number;
  kind: "deposit" | "trade" | "fee";
  desc: string;
  amount: number;
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export default function StatementPage() {
  const deposits: Movement[] = [
    { at: DEMO_NOW - 40 * DAY, kind: "deposit", desc: "Opening deposit", amount: 100_000 },
    { at: DEMO_NOW - 18 * DAY, kind: "deposit", desc: "Top-up", amount: 10_000 },
  ];

  const closed = trades.filter((t) => t.status === "closed");
  const tradeMoves: Movement[] = closed.map((t) => ({
    at: t.closedAt ?? t.openedAt,
    kind: "trade",
    desc: `Closed ${t.pair.replace("USDT", "")}/USDT`,
    amount: realizedPnl(t) ?? 0,
  }));

  const movements = [...deposits, ...tradeMoves].sort((a, b) => a.at - b.at);

  const totalDeposits = deposits.reduce((s, m) => s + m.amount, 0);
  const realized = tradeMoves.reduce((s, m) => s + m.amount, 0);
  const balance = totalDeposits + realized;

  let running = 0;

  return (
    <>
      <PageHeader title="Account Statement" subtitle="Internal balances, deposits, and realized results" />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted">Deposits</p>
          <p className="mt-1 text-xl font-semibold tnum">{usd(totalDeposits)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Realized P&L</p>
          <p className={realized >= 0 ? "mt-1 text-xl font-semibold tnum text-up" : "mt-1 text-xl font-semibold tnum text-down"}>{usd(realized)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Closed trades</p>
          <p className="mt-1 text-xl font-semibold tnum">{closed.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Internal balance</p>
          <p className="mt-1 text-xl font-semibold tnum">{usd(balance)}</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Ledger" subtitle="Chronological movements" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-faint">
                <th className="px-5 py-2.5 font-medium">Date</th>
                <th className="px-5 py-2.5 font-medium">Description</th>
                <th className="px-5 py-2.5 font-medium">Type</th>
                <th className="px-5 py-2.5 text-right font-medium">Amount</th>
                <th className="px-5 py-2.5 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m, i) => {
                running += m.amount;
                return (
                  <tr key={i} className="border-b border-border-soft last:border-0">
                    <td className="px-5 py-3 text-xs text-faint">{fmtDate(m.at)}</td>
                    <td className="px-5 py-3 text-text">{m.desc}</td>
                    <td className="px-5 py-3">
                      <Badge tone={m.kind === "deposit" ? "primary" : m.amount >= 0 ? "up" : "down"}>{m.kind}</Badge>
                    </td>
                    <td className={m.amount >= 0 ? "px-5 py-3 text-right tnum text-up" : "px-5 py-3 text-right tnum text-down"}>{usd(m.amount)}</td>
                    <td className="px-5 py-3 text-right tnum text-muted">{usd(running)}</td>
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
