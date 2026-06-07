import { KeyRound, ShieldCheck, Eye, Globe, Fingerprint, Ban } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, Badge } from "@/components/ui";
import { CredentialEncryptDemo } from "@/components/CredentialEncryptDemo";

const storedKeys = [
  { exchange: "Binance", label: "Spot read-only", masked: "k7Hd••••••••••••3PqW", added: "May 18" },
  { exchange: "Bybit", label: "Alt basket read-only", masked: "9Fa2••••••••••••xR1c", added: "May 22" },
];

const controls = [
  { icon: Eye, label: "Read-only API keys", detail: "No trade or transfer scope unless explicitly enabled" },
  { icon: Ban, label: "Withdrawals disabled", detail: "Withdrawal permission off on every key" },
  { icon: Globe, label: "IP allow-listing", detail: "Keys only accepted from known server IPs" },
  { icon: Fingerprint, label: "MFA (TOTP)", detail: "Required for every console session" },
  { icon: ShieldCheck, label: "Append-only audit log", detail: "Every API event and action is recorded" },
  { icon: KeyRound, label: "Envelope encryption + KMS", detail: "Secrets encrypted at rest; master key in KMS" },
];

const roles = [
  { role: "Owner (Master Trader)", view: true, trade: true, keys: true, admin: true },
  { role: "Analyst", view: true, trade: false, keys: false, admin: false },
  { role: "Viewer", view: true, trade: false, keys: false, admin: false },
  { role: "Auditor", view: true, trade: false, keys: false, admin: false },
];

function YN({ v }: { v: boolean }) {
  return v ? <span className="text-up">✓</span> : <span className="text-faint">—</span>;
}

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Security" subtitle="Credential protection, access control, and operational safeguards" />

      {/* Controls grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {controls.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{c.label}</p>
                  <p className="mt-0.5 text-xs text-faint">{c.detail}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CredentialEncryptDemo />

        <Card>
          <CardHeader title="Stored exchange credentials" subtitle="Encrypted at rest · shown masked" />
          <div className="divide-y divide-border-soft">
            {storedKeys.map((k) => (
              <div key={k.exchange + k.label} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-text">{k.exchange}</p>
                  <p className="text-xs text-faint">{k.label} · added {k.added}</p>
                </div>
                <div className="text-right">
                  <code className="font-mono text-xs text-muted">{k.masked}</code>
                  <div className="mt-1 flex justify-end gap-1">
                    <Badge tone="up">read-only</Badge>
                    <Badge tone="primary">encrypted</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* RBAC matrix */}
      <Card className="mt-4">
        <CardHeader title="Role-based access control" subtitle="Phase 1 runs as Owner; roles are built in for Phase 2 client access" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-faint">
                <th className="px-5 py-2.5 font-medium">Role</th>
                <th className="px-5 py-2.5 text-center font-medium">View</th>
                <th className="px-5 py-2.5 text-center font-medium">Trade</th>
                <th className="px-5 py-2.5 text-center font-medium">Manage keys</th>
                <th className="px-5 py-2.5 text-center font-medium">Admin</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.role} className="border-b border-border-soft last:border-0">
                  <td className="px-5 py-3 text-text">{r.role}</td>
                  <td className="px-5 py-3 text-center"><YN v={r.view} /></td>
                  <td className="px-5 py-3 text-center"><YN v={r.trade} /></td>
                  <td className="px-5 py-3 text-center"><YN v={r.keys} /></td>
                  <td className="px-5 py-3 text-center"><YN v={r.admin} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
