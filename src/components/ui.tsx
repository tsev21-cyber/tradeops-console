import { cn } from "@/lib/utils";

/** Surface card used across every module. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface/80 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border-soft px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "up" | "down" | "warn" | "primary";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-elevated text-muted border-border",
    up: "bg-up/10 text-up border-up/20",
    down: "bg-down/10 text-down border-down/20",
    warn: "bg-warn/10 text-warn border-warn/20",
    primary: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Colored delta text for percentage / pnl values. */
export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const tone = value > 0 ? "text-up" : value < 0 ? "text-down" : "text-muted";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={cn("tnum font-medium", tone)}>
      {sign}
      {value.toFixed(2)}
      {suffix}
    </span>
  );
}
