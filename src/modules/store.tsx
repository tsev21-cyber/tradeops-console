"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Trade, Side } from "@/modules/types";
import { trades as seedTrades } from "@/modules/seed";

/**
 * Client-side trade store with localStorage persistence.
 *
 * Seeded from demo data so SSR and first client render match (no hydration
 * drift); after mount it loads any saved state. This makes the console actually
 * operable — record/close/delete trades and every dependent view updates and
 * survives a reload. In production this is the API + PostgreSQL.
 */

const STORAGE_KEY = "tradeops.trades.v1";
const OWNER = "master-trader";

export interface NewTradeInput {
  pair: string;
  side: Side;
  entry: number;
  quantity: number;
  feePct: number;
  portfolioId: string;
  note?: string;
}

interface TradeStore {
  trades: Trade[];
  hydrated: boolean;
  addTrade: (input: NewTradeInput) => void;
  closeTrade: (id: string, exit: number) => void;
  deleteTrade: (id: string) => void;
  reset: () => void;
}

const Ctx = createContext<TradeStore | null>(null);

export function TradesProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(seedTrades);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTrades(JSON.parse(raw) as Trade[]);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist on every change, once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    } catch {
      /* storage full / unavailable */
    }
  }, [trades, hydrated]);

  const addTrade = useCallback((input: NewTradeInput) => {
    setTrades((prev) => {
      const seq = 1100 + prev.length;
      const trade: Trade = {
        id: `T-${seq}`,
        ownerId: OWNER,
        portfolioId: input.portfolioId,
        pair: input.pair,
        side: input.side,
        status: "open",
        entry: input.entry,
        quantity: input.quantity,
        feePct: input.feePct,
        openedAt: Date.now(),
        note: input.note,
      };
      return [trade, ...prev];
    });
  }, []);

  const closeTrade = useCallback((id: string, exit: number) => {
    setTrades((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "closed", exit, closedAt: Date.now() } : t,
      ),
    );
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reset = useCallback(() => setTrades(seedTrades), []);

  return (
    <Ctx.Provider value={{ trades, hydrated, addTrade, closeTrade, deleteTrade, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTrades(): TradeStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTrades must be used within TradesProvider");
  return ctx;
}
