"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Activity, ShieldCheck, UserRound, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { navItems } from "@/components/nav";

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Activity className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-text">TradeOps</p>
        <p className="text-[10px] uppercase tracking-wider text-faint">Internal Console</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-0.5 px-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active ? "bg-primary/10 text-text" : "text-muted hover:bg-elevated hover:text-text",
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-faint group-hover:text-muted")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface/60 md:flex">
        <div className="px-5 py-5">
          <Brand />
        </div>
        <NavList />
        <div className="border-t border-border-soft px-5 py-4">
          <p className="text-[10px] leading-relaxed text-faint">
            Phase 1 MVP demo · prototype built for technical validation
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-surface">
            <div className="flex items-center justify-between px-5 py-5">
              <Brand />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-faint hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface/40 px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-text md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <span className="live-dot h-2 w-2 rounded-full bg-up" />
              <span className="hidden sm:inline">Live · Binance public market data</span>
              <span className="sm:hidden">Live</span>
            </span>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <Badge tone="primary" className="hidden sm:inline-flex">
              <ShieldCheck className="h-3 w-3" />
              MFA on · read-only keys
            </Badge>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-elevated text-muted">
                <UserRound className="h-3.5 w-3.5" />
              </div>
              <div className="hidden leading-tight sm:block">
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

        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
