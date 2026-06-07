import {
  LayoutDashboard,
  CandlestickChart,
  Wallet,
  NotebookPen,
  Calculator,
  ReceiptText,
  ShieldAlert,
  ScrollText,
  KeyRound,
  Network,
  Map,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Navigation maps 1:1 to the client's Phase 1 modules. */
export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/market", label: "Live Market", icon: CandlestickChart },
  { href: "/portfolios", label: "Portfolios", icon: Wallet },
  { href: "/journal", label: "Trade Journal", icon: NotebookPen },
  { href: "/calculator", label: "DCA Calculator", icon: Calculator },
  { href: "/statement", label: "Account Statement", icon: ReceiptText },
  { href: "/risk", label: "Risk Review", icon: ShieldAlert },
  { href: "/audit", label: "Audit Log", icon: ScrollText },
  { href: "/security", label: "Security", icon: KeyRound },
  { href: "/architecture", label: "Architecture", icon: Network },
  { href: "/roadmap", label: "Roadmap", icon: Map },
];
