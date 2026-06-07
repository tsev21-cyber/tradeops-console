import { ScrollText, Lock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, Badge } from "@/components/ui";
import { auditEvents, DEMO_NOW } from "@/modules/seed";
import { timeAgo } from "@/lib/utils";

const toneFor = (action: string): "up" | "down" | "warn" | "primary" | "neutral" => {
  if (action.includes("LOGIN") || action.includes("MFA")) return "primary";
  if (action.includes("RATE_LIMIT")) return "warn";
  if (action.includes("CLOSE")) return "neutral";
  if (action.includes("OPEN")) return "up";
  return "neutral";
};

export default function AuditPage() {
  return (
    <>
      <PageHeader title="Audit Log" subtitle="Append-only record of actions, API events, and safeguards" />

      <Card className="mb-4 border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-sm text-text">
          <Lock className="h-4 w-4 text-primary" />
          Entries are append-only and tamper-evident (hash-chained in production). Nothing here can be edited or deleted.
        </div>
      </Card>

      <Card>
        <CardHeader title="Recent events" subtitle={`${auditEvents.length} entries`} action={<ScrollText className="h-4 w-4 text-faint" />} />
        <div className="divide-y divide-border-soft">
          {auditEvents.map((e) => (
            <div key={e.id} className="flex items-start gap-4 px-5 py-3.5">
              <div className="w-20 shrink-0 text-[11px] text-faint">{timeAgo(e.at, DEMO_NOW)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge tone={toneFor(e.action)}>{e.action}</Badge>
                  <span className="text-sm text-text">{e.target}</span>
                </div>
                {e.meta && <p className="mt-1 text-xs text-faint">{e.meta}</p>}
              </div>
              <div className="shrink-0 text-right text-[11px] text-faint">
                <p className="font-mono">{e.id}</p>
                <p>{e.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
