import { CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Badge } from "@/components/ui";

const milestones = [
  {
    n: 0,
    title: "Discovery & architecture sign-off",
    weeks: "~1 wk",
    items: ["Finalize data model", "Security design", "Exchange selection", "Post-NDA scope"],
    shown: "Architecture view in this prototype",
  },
  {
    n: 1,
    title: "Foundation",
    weeks: "~2 wks",
    items: ["Repo + CI/CD", "Auth + RBAC", "Audit-log skeleton", "DB schema"],
    shown: "Console shell, auth model, audit log",
  },
  {
    n: 2,
    title: "Exchange connector (read-only)",
    weeks: "~2 wks",
    items: ["Balances, trades, orders", "Fills & fees", "Rate-limit + backoff", "Testnet first"],
    shown: "Live Market — real Binance data",
  },
  {
    n: 3,
    title: "Portfolios, statement & journal",
    weeks: "~2 wks",
    items: ["Multi-portfolio", "Internal statement", "Trade journal / log"],
    shown: "Portfolios, Statement, Journal",
  },
  {
    n: 4,
    title: "Dashboard & calculator",
    weeks: "~1.5 wks",
    items: ["KPIs & equity curve", "DCA / average-price tool"],
    shown: "Dashboard, DCA Calculator",
  },
  {
    n: 5,
    title: "Risk module & alerts",
    weeks: "~1.5 wks",
    items: ["Exposure & concentration", "Pre-trade checks", "Operational alerts"],
    shown: "Risk Review",
  },
  {
    n: 6,
    title: "Hardening & UAT",
    weeks: "~1 wk",
    items: ["Security review", "Reconciliation", "Testing", "UAT with Master Trader"],
    shown: "—",
  },
];

export default function RoadmapPage() {
  return (
    <>
      <PageHeader title="Roadmap" subtitle="Phase 1 delivery plan · ~10–12 weeks solo, adjustable after NDA scope" />

      <div className="space-y-3">
        {milestones.map((m) => {
          const demoed = m.shown !== "—";
          return (
            <Card key={m.n} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm text-primary">
                  M{m.n}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-text">{m.title}</h3>
                    <Badge>{m.weeks}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {m.items.map((it) => (
                      <span key={it} className="flex items-center gap-1.5 text-xs text-muted">
                        <Circle className="h-2.5 w-2.5 text-faint" /> {it}
                      </span>
                    ))}
                  </div>
                  {demoed && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-up">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Demonstrated in this prototype: {m.shown}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
