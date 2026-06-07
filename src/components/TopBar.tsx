import Link from "next/link";
import { ShieldCheck, UserRound, LogOut } from "lucide-react";
import { Badge } from "@/components/ui";

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface/40 px-5">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="live-dot h-2 w-2 rounded-full bg-up" />
          Live · Binance public market data
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Badge tone="primary">
          <ShieldCheck className="h-3 w-3" />
          MFA on · read-only keys
        </Badge>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-elevated text-muted">
            <UserRound className="h-3.5 w-3.5" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-text">Master Trader</p>
            <p className="text-[10px] text-faint">role: owner</p>
          </div>
        </div>
        <Link
          href="/login"
          aria-label="Sign out"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-faint hover:border-down hover:text-down"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}
