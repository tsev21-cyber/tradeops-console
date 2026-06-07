"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usdCompact } from "@/lib/utils";

export function EquityChart({ data }: { data: { t: number; equity: number }[] }) {
  const fmtDay = (t: number) =>
    new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="t"
          tickFormatter={fmtDay}
          stroke="#5b6678"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          minTickGap={40}
        />
        <YAxis
          tickFormatter={(v) => usdCompact(v)}
          stroke="#5b6678"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={56}
          domain={["dataMin - 4000", "dataMax + 4000"]}
        />
        <Tooltip
          contentStyle={{
            background: "#111722",
            border: "1px solid #232c3d",
            borderRadius: 10,
            fontSize: 12,
          }}
          labelStyle={{ color: "#8b95a9" }}
          labelFormatter={(t) => fmtDay(Number(t))}
          formatter={(v: number) => [usdCompact(v), "Equity"]}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#equityFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
