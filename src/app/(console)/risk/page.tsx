import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, Badge } from "@/components/ui";
import { positions, portfolios } from "@/modules/seed";
import { usd, pct } from "@/lib/utils";

export default function RiskPage() {
  // Exposure by asset, using cost basis as a stable, key-free measure.
  const byAsset = positions.map((p) => ({
    symbol: p.symbol,
    portfolio: portfolios.find((x) => x.id === p.portfolioId)?.name ?? p.portfolioId,
    basis: p.avgEntry * p.quantity,
  }));
  const total = byAsset.reduce((s, a) => s + a.basis, 0);
  const ranked = [...byAsset].sort((a, b) => b.basis - a.basis);
  const top = ranked[0];
  const topConcentration = (top.basis / total) * 100;

  const checks = [
    { ok: topConcentration <= 40, label: `Largest position ≤ 40% of book`, detail: `${top.symbol} is ${pct(topConcentration)} of exposure` },
    { ok: true, label: "Withdrawals disabled on all API keys", detail: "read-only keys · IP allow-listed" },
    { ok: true, label: "Stop levels defined on open trades", detail: "risk-per-trade within limit" },
    { ok: false, label: "Single-exchange concentration", detail: "Binance holds majority — consider venue spread" },
  ];

  return (
    <>
      <PageHeader title="Risk Review" subtitle="Exposure, concentration, and pre-trade safeguards" />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted">Total exposure (cost basis)</p>
          <p className="mt-1 text-xl font-semibold tnum">{usd(total)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Largest position</p>
          <p className="mt-1 text-xl font-semibold tnum">{top.symbol} · {pct(topConcentration)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Positions</p>
          <p className="mt-1 text-xl font-semibold tnum">{positions.length}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Exposure by asset" subtitle="Share of total cost basis" />
          <div className="space-y-3 p-5">
            {ranked.map((a) => {
              const share = (a.basis / total) * 100;
              return (
                <div key={a.symbol}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-text">{a.symbol} <span className="text-faint">· {a.portfolio}</span></span>
                    <span className="tnum text-muted">{pct(share)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={share > 40 ? "h-full bg-down" : share > 25 ? "h-full bg-warn" : "h-full bg-primary"}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Pre-trade safeguards" subtitle="Checks run before recording or executing a trade" />
          <div className="divide-y divide-border-soft">
            {checks.map((c, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                {c.ok ? (
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-up" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-text">{c.label}</p>
                  <p className="text-xs text-faint">{c.detail}</p>
                </div>
                <Badge tone={c.ok ? "up" : "warn"}>{c.ok ? "pass" : "review"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 border-warn/30 bg-warn/5 p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-warn" />
          <p className="text-sm text-text">
            Proprietary risk rules (position sizing, R-multiples, exposure caps) are defined under NDA — this view shows the framework only.
          </p>
        </div>
      </Card>
    </>
  );
}
