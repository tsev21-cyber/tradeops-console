"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, Delta } from "@/components/ui";
import { usd } from "@/lib/utils";

interface Entry {
  id: number;
  price: string;
  qty: string;
}

let nextId = 100;

export default function CalculatorPage() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, price: "58000", qty: "0.3" },
    { id: 2, price: "54000", qty: "0.3" },
    { id: 3, price: "50000", qty: "0.4" },
  ]);
  const [feePct, setFeePct] = useState("0.1");
  const [current, setCurrent] = useState("61000");

  const fee = Number(feePct) || 0;
  const parsed = entries
    .map((e) => ({ price: Number(e.price), qty: Number(e.qty) }))
    .filter((e) => e.price > 0 && e.qty > 0);

  const totalQty = parsed.reduce((s, e) => s + e.qty, 0);
  const grossCost = parsed.reduce((s, e) => s + e.price * e.qty, 0);
  const feeCost = grossCost * (fee / 100);
  const totalCost = grossCost + feeCost;
  const avg = totalQty > 0 ? grossCost / totalQty : 0;

  const cur = Number(current) || 0;
  const marketValue = cur * totalQty;
  const exitFee = marketValue * (fee / 100);
  const unrealized = marketValue - totalCost - exitFee;
  const unrealizedPct = totalCost > 0 ? (unrealized / totalCost) * 100 : 0;
  const breakeven = totalQty > 0 ? totalCost / totalQty / (1 - fee / 100) : 0;

  const update = (id: number, field: "price" | "qty", value: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const remove = (id: number) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const add = () => setEntries((prev) => [...prev, { id: ++nextId, price: "", qty: "" }]);

  const inputCls =
    "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary tnum";

  return (
    <>
      <PageHeader title="DCA / Average-Price Calculator" subtitle="Plan multiple entries, average price, fees, and result before committing" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Entries" subtitle="Add each planned or executed buy" />
          <div className="space-y-3 p-5">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 text-xs text-faint">
              <span>Price (USDT)</span>
              <span>Quantity</span>
              <span className="w-8" />
            </div>
            {entries.map((e) => (
              <div key={e.id} className="grid grid-cols-[1fr_1fr_auto] gap-3">
                <input className={inputCls} inputMode="decimal" value={e.price} onChange={(ev) => update(e.id, "price", ev.target.value)} placeholder="0.00" />
                <input className={inputCls} inputMode="decimal" value={e.qty} onChange={(ev) => update(e.id, "qty", ev.target.value)} placeholder="0.00" />
                <button onClick={() => remove(e.id)} className="flex w-8 items-center justify-center rounded-lg border border-border text-faint hover:border-down hover:text-down" aria-label="remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button onClick={add} className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted hover:border-primary hover:text-primary">
              <Plus className="h-4 w-4" /> Add entry
            </button>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs text-faint">Fee %</label>
                <input className={inputCls} inputMode="decimal" value={feePct} onChange={(ev) => setFeePct(ev.target.value)} />
              </div>
              <div>
                <label className="text-xs text-faint">Current price (USDT)</label>
                <input className={inputCls} inputMode="decimal" value={current} onChange={(ev) => setCurrent(ev.target.value)} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Result" subtitle="Live as you type" />
          <div className="space-y-4 p-5">
            <Metric label="Average entry" value={usd(avg, avg < 1 ? 4 : 2)} big />
            <Metric label="Total quantity" value={totalQty.toLocaleString("en-US", { maximumFractionDigits: 8 })} />
            <Metric label="Gross cost" value={usd(grossCost)} />
            <Metric label="Fees" value={usd(feeCost)} />
            <Metric label="Total cost (incl. fees)" value={usd(totalCost)} />
            <Metric label="Break-even price" value={usd(breakeven, breakeven < 1 ? 4 : 2)} />
            <div className="border-t border-border-soft pt-4">
              <Metric label="Market value" value={usd(marketValue)} />
              <div className="mt-3 flex items-end justify-between">
                <span className="text-xs text-muted">Unrealized P&L</span>
                <div className="text-right">
                  <div className={unrealized >= 0 ? "tnum text-lg font-semibold text-up" : "tnum text-lg font-semibold text-down"}>{usd(unrealized)}</div>
                  <Delta value={unrealizedPct} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function Metric({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted">{label}</span>
      <span className={big ? "tnum text-xl font-semibold text-text" : "tnum text-sm text-text"}>{value}</span>
    </div>
  );
}
