import {
  Layers,
  Boxes,
  Database,
  Radio,
  ShieldCheck,
  ArrowDown,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Badge } from "@/components/ui";

const principles = [
  ["Modular monolith", "One deployable for Phase 1 speed, split into services only when load demands it."],
  ["Multi-tenant from day one", "Every record carries an ownerId, so Phase 2 client accounts need no migration."],
  ["API-first", "UI and future mobile/desktop clients consume the same typed API."],
  ["Exchange behind an interface", "All exchange access goes through one CCXT-backed adapter — add a venue, not a rewrite."],
];

const domainModules = [
  { name: "auth", note: "RBAC, MFA, sessions" },
  { name: "exchange", note: "CCXT connector, sync" },
  { name: "portfolio", note: "valuation, positions" },
  { name: "trading", note: "journal, P&L" },
  { name: "risk", note: "exposure, pre-trade checks" },
  { name: "audit", note: "append-only events" },
  { name: "security", note: "credential vault" },
  { name: "dashboard", note: "KPIs, aggregation" },
];

const phase2 = [
  "onboarding",
  "signals",
  "notifications",
  "payments",
  "referrals",
  "support",
  "community",
  "membership",
];

function Layer({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: typeof Layers;
  title: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${tone}`} />
        <h3 className="text-sm font-semibold text-text">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function Chip({ children, dashed = false }: { children: React.ReactNode; dashed?: boolean }) {
  return (
    <span
      className={`rounded-lg border px-2.5 py-1.5 text-xs ${
        dashed
          ? "border-dashed border-border text-muted"
          : "border-border bg-elevated text-text"
      }`}
    >
      {children}
    </span>
  );
}

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader
        title="Architecture"
        subtitle="Modular monolith, structured so Phase 1 grows into Phase 2 without a rebuild"
      />

      {/* Principles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map(([title, note]) => (
          <Card key={title} className="p-4">
            <p className="text-sm font-medium text-text">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>
          </Card>
        ))}
      </div>

      {/* Layered view */}
      <div className="mt-6 space-y-2">
        <Layer icon={Layers} title="Presentation — Next.js App Router" tone="text-primary">
          <div className="flex flex-wrap gap-2">
            <Chip>/dashboard</Chip>
            <Chip>/market</Chip>
            <Chip>/portfolios</Chip>
            <Chip>/journal</Chip>
            <Chip>/risk</Chip>
            <Chip>/audit</Chip>
            <span className="self-center text-xs text-faint">
              thin route composition · shared React components
            </span>
          </div>
        </Layer>

        <div className="flex justify-center">
          <ArrowDown className="h-4 w-4 text-faint" />
        </div>

        <Layer icon={Boxes} title="Domain — bounded modules (src/modules)" tone="text-accent">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {domainModules.map((m) => (
              <div key={m.name} className="rounded-lg border border-border bg-surface-2 p-2.5">
                <p className="font-mono text-xs text-text">{m.name}</p>
                <p className="mt-0.5 text-[11px] text-faint">{m.note}</p>
              </div>
            ))}
          </div>
        </Layer>

        <div className="flex justify-center">
          <ArrowDown className="h-4 w-4 text-faint" />
        </div>

        {/* Event bus seam */}
        <Card className="border-accent/30 bg-accent/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Radio className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-text">Event bus</h3>
            <Badge tone="primary">Redis pub/sub in prod</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip>trade.opened</Chip>
            <Chip>trade.closed</Chip>
            <Chip>portfolio.revalued</Chip>
            <Chip>exchange.synced</Chip>
            <Chip>risk.alert</Chip>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Modules publish events instead of calling each other. Phase 1 subscribers: audit log,
            dashboard. Phase 2 modules subscribe to the <em>same</em> events — added as new files,
            with zero changes to Phase 1 code.
          </p>
        </Card>

        <div className="flex justify-center">
          <ArrowDown className="h-4 w-4 text-faint" />
        </div>

        <Layer icon={Database} title="Infrastructure" tone="text-muted">
          <div className="flex flex-wrap gap-2">
            <Chip>PostgreSQL + TimescaleDB</Chip>
            <Chip>Redis (cache · queue · pub/sub)</Chip>
            <Chip>Exchange connector (CCXT)</Chip>
            <Chip>
              <ShieldCheck className="mr-1 inline h-3 w-3 text-up" />
              KMS / Secrets vault
            </Chip>
          </div>
        </Layer>
      </div>

      {/* Phase 1 vs Phase 2 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Phase 1 — built now</h3>
            <Badge tone="up">live in this demo</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {domainModules.map((m) => (
              <Chip key={m.name}>{m.name}</Chip>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Phase 2 — plugs into the same seams</h3>
            <Badge>future</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {phase2.map((m) => (
              <Chip key={m} dashed>
                {m}
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Each subscribes to existing domain events and reuses auth, the exchange layer, and the
            shared schema — no Phase 1 rewrite.
          </p>
        </Card>
      </div>
    </>
  );
}
