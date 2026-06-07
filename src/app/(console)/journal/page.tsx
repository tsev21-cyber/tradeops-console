"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, RotateCcw, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, Badge, Delta } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { useTrades, type NewTradeInput } from "@/modules/store";
import { portfolios } from "@/modules/seed";
import { WATCHLIST } from "@/modules/exchange/symbols";
import { realizedPnl, realizedPnlPct, notional, tradeStats } from "@/modules/trading/logic";
import { usd } from "@/lib/utils";
import type { Side } from "@/modules/types";

function fmtDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary";

const emptyForm: NewTradeInput = {
  pair: "BTCUSDT",
  side: "buy",
  entry: 0,
  quantity: 0,
  feePct: 0.1,
  portfolioId: "core",
  note: "",
};

type Sort = "new" | "old" | "pnl";

export default function JournalPage() {
  const { trades, hydrated, addTrade, closeTrade, deleteTrade, reset } = useTrades();

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<NewTradeInput>(emptyForm);
  const [closing, setClosing] = useState<string | null>(null);
  const [exitPrice, setExitPrice] = useState("");
  const [sort, setSort] = useState<Sort>("new");

  // Prefill + auto-open when arriving from Live Market (?pair=&price=).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pair = params.get("pair");
    const price = params.get("price");
    if (pair || price) {
      setForm((f) => ({
        ...f,
        pair: pair ?? f.pair,
        entry: price ? Number(price) : f.entry,
      }));
      setAddOpen(true);
    }
  }, []);

  const stats = tradeStats(trades);

  const sorted = useMemo(() => {
    const arr = [...trades];
    if (sort === "new") arr.sort((a, b) => b.openedAt - a.openedAt);
    if (sort === "old") arr.sort((a, b) => a.openedAt - b.openedAt);
    if (sort === "pnl") arr.sort((a, b) => (realizedPnl(b) ?? -Infinity) - (realizedPnl(a) ?? -Infinity));
    return arr;
  }, [trades, sort]);

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    if (form.entry <= 0 || form.quantity <= 0) return;
    addTrade(form);
    setForm(emptyForm);
    setAddOpen(false);
  }

  function submitClose(e: React.FormEvent) {
    e.preventDefault();
    const exit = Number(exitPrice);
    if (!closing || exit <= 0) return;
    closeTrade(closing, exit);
    setClosing(null);
    setExitPrice("");
  }

  return (
    <>
      <PageHeader title="Trade Journal" subtitle="Record, close, and review trades — saved in your browser">
        <div className="flex items-center gap-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted hover:text-text"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset demo
          </button>
          <button
            onClick={() => { setForm(emptyForm); setAddOpen(true); }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New trade
          </button>
        </div>
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-3"><p className="text-xs text-muted">Net realized</p><p className="mt-1 text-lg font-semibold tnum">{usd(stats.netRealized)}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted">Win rate</p><p className="mt-1 text-lg font-semibold tnum">{stats.winRate.toFixed(0)}%</p></Card>
        <Card className="p-3"><p className="text-xs text-muted">Open</p><p className="mt-1 text-lg font-semibold tnum">{stats.open}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted">Closed</p><p className="mt-1 text-lg font-semibold tnum">{stats.closed}</p></Card>
      </div>

      <Card>
        <CardHeader
          title="All trades"
          subtitle={hydrated ? `${trades.length} entries` : "loading…"}
          action={
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-lg border border-border bg-surface-2 px-2 py-1 text-xs text-muted outline-none">
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="pnl">Best P&L</option>
            </select>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-faint">
                <th className="px-5 py-2.5 font-medium">ID</th>
                <th className="px-5 py-2.5 font-medium">Pair</th>
                <th className="px-5 py-2.5 font-medium">Side</th>
                <th className="px-5 py-2.5 text-right font-medium">Entry</th>
                <th className="px-5 py-2.5 text-right font-medium">Exit</th>
                <th className="px-5 py-2.5 text-right font-medium">Size</th>
                <th className="px-5 py-2.5 text-right font-medium">P&L</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => {
                const pnl = realizedPnl(t);
                const pnlPct = realizedPnlPct(t);
                return (
                  <tr key={t.id} className="border-b border-border-soft last:border-0 hover:bg-elevated/40">
                    <td className="px-5 py-3 font-mono text-xs text-faint">{t.id}</td>
                    <td className="px-5 py-3 font-medium text-text">{t.pair.replace("USDT", "")}/USDT</td>
                    <td className="px-5 py-3"><Badge tone={t.side === "buy" ? "up" : "down"}>{t.side}</Badge></td>
                    <td className="px-5 py-3 text-right tnum text-muted">{usd(t.entry, t.entry < 1 ? 4 : 2)}</td>
                    <td className="px-5 py-3 text-right tnum text-muted">{t.exit ? usd(t.exit, t.exit < 1 ? 4 : 2) : "—"}</td>
                    <td className="px-5 py-3 text-right tnum text-muted">{usd(notional(t))}</td>
                    <td className="px-5 py-3 text-right">
                      {pnl != null ? (
                        <div>
                          <div className={pnl >= 0 ? "tnum text-up" : "tnum text-down"}>{usd(pnl)}</div>
                          {pnlPct != null && <Delta value={pnlPct} />}
                        </div>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3"><Badge tone={t.status === "open" ? "primary" : "neutral"}>{t.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === "open" && (
                          <button
                            onClick={() => { setClosing(t.id); setExitPrice(String(t.entry)); }}
                            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted hover:border-up hover:text-up"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Close
                          </button>
                        )}
                        <button
                          onClick={() => { if (confirm(`Delete ${t.id}?`)) deleteTrade(t.id); }}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-faint hover:border-down hover:text-down"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add trade modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New trade">
        <form onSubmit={submitAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-faint">Pair</label>
              <select className={inputCls} value={form.pair} onChange={(e) => setForm({ ...form, pair: e.target.value })}>
                {WATCHLIST.map((w) => <option key={w.pair} value={w.pair}>{w.symbol}/USDT</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-faint">Side</label>
              <select className={inputCls} value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value as Side })}>
                <option value="buy">buy</option>
                <option value="sell">sell</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-faint">Entry price</label>
              <input className={inputCls} inputMode="decimal" value={form.entry || ""} onChange={(e) => setForm({ ...form, entry: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-faint">Quantity</label>
              <input className={inputCls} inputMode="decimal" value={form.quantity || ""} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-faint">Fee %</label>
              <input className={inputCls} inputMode="decimal" value={form.feePct} onChange={(e) => setForm({ ...form, feePct: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-faint">Portfolio</label>
              <select className={inputCls} value={form.portfolioId} onChange={(e) => setForm({ ...form, portfolioId: e.target.value })}>
                {portfolios.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-faint">Note</label>
            <input className={inputCls} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Thesis, plan, context…" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90">
            Record trade
          </button>
        </form>
      </Modal>

      {/* Close trade modal */}
      <Modal open={closing != null} onClose={() => setClosing(null)} title={`Close ${closing ?? ""}`}>
        <form onSubmit={submitClose} className="space-y-3">
          <div>
            <label className="text-xs text-faint">Exit price</label>
            <input autoFocus className={inputCls} inputMode="decimal" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} />
          </div>
          <button type="submit" className="w-full rounded-lg bg-up py-2.5 text-sm font-medium text-white hover:opacity-90">
            Close trade
          </button>
        </form>
      </Modal>
    </>
  );
}
