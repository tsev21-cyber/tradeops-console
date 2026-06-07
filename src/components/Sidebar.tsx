"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CandlestickChart,
  Wallet,
  NotebookPen,
  Calculator,
  ReceiptText,
  ShieldAlert,
  ScrollText,
  Map,
  Network,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Navigation maps 1:1 to the client's Phase 1 modules. */
const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, module: "Dashboard / KPIs" },
  { href: "/market", label: "Live Market", icon: CandlestickChart, module: "API Import & Execution" },
  { href: "/portfolios", label: "Portfolios", icon: Wallet, module: "Multi-Portfolio" },
  { href: "/journal", label: "Trade Journal", icon: NotebookPen, module: "Journal / Trade Log" },
  { href: "/calculator", label: "DCA Calculator", icon: Calculator, module: "Avg Price / DCA" },
  { href: "/statement", label: "Account Statement", icon: ReceiptText, module: "Internal Statement" },
  { href: "/risk", label: "Risk Review", icon: ShieldAlert, module: "Risk Management" },
  { href: "/audit", label: "Audit Log", icon: ScrollText, module: "Audit & Safeguards" },
  { href: "/architecture", label: "Architecture", icon: Network, module: "System design" },
  { href: "/roadmap", label: "Roadmap", icon: Map, module: "Delivery plan" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface/60 md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Activity className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-text">TradeOps</p>
          <p className="text-[10px] uppercase tracking-wider text-faint">Internal Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-text"
                  : "text-muted hover:bg-elevated hover:text-text",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-primary" : "text-faint group-hover:text-muted",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-soft px-5 py-4">
        <p className="text-[10px] leading-relaxed text-faint">
          Phase 1 MVP demo · prototype built for technical validation
        </p>
      </div>
    </aside>
  );
}
